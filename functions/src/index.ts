import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import admin from 'firebase-admin';
import { https } from 'firebase-functions';
import { DateScalar, DateTimeScalar, TimeScalar } from 'graphql-date-scalars';

admin.initializeApp();
const firestore = admin.firestore();
firestore.settings({ ignoreUndefinedProperties: true });

// TODO: migrate to type-graphql?
enum Cuisine {
  COUNTRY = 'COUNTRY',
  NOT_COUNTRY = 'NOT_COUNTRY',
}
enum FeatureList {
  KID_FRIENDLY = 'KID_FRIENDLY',
  VEGETARIAN = 'VEGETARIAN',
  VEGAN = 'VEGAN',
  VIEW = 'VIEW',
  INSTAGRAM = 'INSTAGRAM',
  ALCOHOL = 'ALCOHOL',
  CLOSE_ATTRACTIONS = 'CLOSE_ATTRACTIONS',
  OUTDOOR_SEATING = 'OUTDOOR_SEATING',
  NON_SMOKING = 'NON_SMOKING',
}
type Features = {
  [key in FeatureList]: number;
};
interface Restaurant {
  id: string,
  name: string,
  address: string,
  price: number,
  cuisine: Cuisine,
  features: Features,
  topFeatures: FeatureList[], // string list of features above 2
  score: number, // dynamic based on query
  timestampAdded: admin.firestore.Timestamp,
  timestampUpdated: admin.firestore.Timestamp,
}

interface QuizLog {
  id: string,
  minBudget: number,
  maxBudget: number,
  cuisine: Cuisine,
  features: Features,
  resultId: string,
  resultName: string,
  result: Restaurant,
  timestampAdded: admin.firestore.Timestamp,
}
interface addRestaurantInput {
  name: string,
  address: string,
  price: number,
  cuisine: Cuisine,
  features: Features,
}
interface editRestaurantInput {
  id: string,
  name?: string,
  address?: string,
  price?: number,
  cuisine?: Cuisine,
  features?: Features,
}
interface getRestaurantInput {
  minBudget?: number,
  maxBudget?: number,
  cuisine?: Cuisine,
  features?: Features,
}
interface getAllRestaurantInput {
  limitNum?: number,
  cursor?: string, // name
}
interface getQuizLogsInput {
  cursor?: string,
}

const typeDefs = gql`
  type Query {
    getRestaurant(id: ID!): Restaurant
    getRestaurants(input: GetRestaurantsInput): [Restaurant]!
    getAllRestaurants: [Restaurant]!
    getQuizLogs(input: GetQuizLogsInput): [QuizLog]!
  }
  type Mutation {
    addRestaurant(input: AddRestaurantInput!): ID!
    editRestaurant(input: EditRestaurantInput!): ID!
    deleteRestaurant(id: ID!): ID!
  }
  type Restaurant {
    id: ID!
    name: String!
    address: String!
    price: Float!
    cuisine: String! # Cuisine Enum
    features: Features!
    topFeatures: [FeatureList]!
    score: Float # Temp score for getRestaurants query
    timestampAdded: DateTime!
    timestampUpdated: DateTime!
  }
  type Features {
    KID_FRIENDLY: Int
    VEGETARIAN: Int
    VEGAN: Int
    VIEW: Int
    INSTAGRAM: Int
    ALCOHOL: Int
    CLOSE_ATTRACTIONS: Int
    OUTDOOR_SEATING: Int
    NON_SMOKING: Int
  }
  type QuizLog {
    id: ID!
    minBudget: Float
    maxBudget: Float
    cuisine: String # Cuisine Enum
    features: Features
    resultId: ID
    resultName: String
    result: Restaurant
    timestampAdded: DateTime!
  }
  enum FeatureList {
    KID_FRIENDLY
    VEGETARIAN
    VEGAN
    VIEW
    INSTAGRAM
    ALCOHOL
    CLOSE_ATTRACTIONS
    OUTDOOR_SEATING
    NON_SMOKING
  }
  scalar Date
  scalar Time
  scalar DateTime
  input FeaturesInput {
    KID_FRIENDLY: Int
    VEGETARIAN: Int
    VEGAN: Int
    VIEW: Int
    INSTAGRAM: Int
    ALCOHOL: Int
    CLOSE_ATTRACTIONS: Int
    OUTDOOR_SEATING: Int
    NON_SMOKING: Int
  }
  input GetRestaurantsInput {
    minBudget: Float
    maxBudget: Float
    cuisine: String # Cuisine Enum
    features: FeaturesInput
  }
  input AddRestaurantInput {
    name: String!
    address: String!
    price: Float!
    cuisine: String! # Cuisine Enum
    features: FeaturesInput!
  }
  input EditRestaurantInput {
    id: ID!
    name: String
    address: String
    price: Float
    cuisine: String # Cuisine Enum
    features: FeaturesInput
  }
  input GetQuizLogsInput {
    cursor: String
  }
`;

const getRestaurant = async (_: never, { id }: { id: string }): Promise<Restaurant> => {
  try {
    const restaurantRef = await firestore.collection('restaurants').doc(id).get();
    if (!restaurantRef.exists) {
      throw new Error(`Could not find restaurant from id ${id}`);
    }

    const restaurant = restaurantRef.data() as Restaurant;
    restaurant.id = id;

    return restaurant;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    throw err;
  }
};

const getAllRestaurants = async (_: never, { input = {} }: { input?: getAllRestaurantInput }): Promise<Restaurant[]> => {
  try {
    const {
      limitNum = 25,
      cursor,
    } = input;
    const collectionRef = firestore.collection('restaurants');
    let query = collectionRef.orderBy('name');
    if (cursor) {
      query = query.startAfter(cursor);
    }
    query = query.limit(limitNum);

    const documentSnapshots = await query.get();

    // map documentSnapshots to array of objects
    const list: Restaurant[] = [];
    documentSnapshots.forEach((docSnap) => list.push({
      ...docSnap.data(), id: docSnap.id,
    } as Restaurant));

    return list;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    throw err;
  }
};

const getRestaurants = async (_: never, { input = {} }: { input?: getRestaurantInput }): Promise<Restaurant[]> => {
  try {
    const {
      minBudget,
      maxBudget,
      cuisine,
      features,
    } = input;
    if (
      typeof minBudget !== 'number' &&
      typeof maxBudget !== 'number' &&
      !cuisine &&
      typeof features === 'undefined'
    ) {
      return [];
    }

    if (
      typeof minBudget === 'number' &&
      typeof maxBudget === 'number' &&
      minBudget > maxBudget
    ) {
      throw new Error('min budget cannot be larger than max');
    }

    const featureKeys = typeof features !== 'undefined' ? Object.keys(features) : [];
    const featureLength = featureKeys.length;

    let query = firestore.collection('restaurants') as admin.firestore.Query<admin.firestore.DocumentData>;
    if (typeof minBudget === 'number' || typeof maxBudget === 'number') {
      query = query.orderBy('price');
    }
    if (typeof minBudget === 'number') {
      query = query.where('price', '>=', minBudget);
    }
    if (typeof maxBudget === 'number') {
      query = query.where('price', '<=', maxBudget);
    }
    if (cuisine) {
      query = query.where('cuisine', '==', cuisine);
    }
    if (featureLength) {
      query = query.where('topFeatures', 'array-contains-any', featureKeys);
      // featureKeys.map((key) => {
      // query = query.orderBy(key).where(key, '>=', 3);
      // });
    }
    query = query.orderBy('name');
    query = query.limit(100);

    const queryResults = await query.get();

    if (queryResults.empty) {
      await firestore.collection('quiz-logs').add({
        minBudget,
        maxBudget,
        cuisine,
        features,
        timestampAdded: new Date(),
      });
      return [];
    }

    const data: Restaurant[] = [];
    queryResults.forEach((queryDoc) => {
      const restaurant = queryDoc.data() as Restaurant;
      restaurant.id = queryDoc.id;
      if (!featureLength || !Object.keys(restaurant.features).length) {
        // todo: compute score based on all features?
        restaurant.score = 5;
        data.push(restaurant);
        return;
      }

      const cumulativeScore = featureKeys.reduce((acc, curr) => {
        const restaurantFeature = restaurant.features[curr as keyof Features] || -1;
        return acc + restaurantFeature;
      }, 0);

      restaurant.score = +(cumulativeScore / featureLength).toFixed(2);
      data.push(restaurant);
    });

    data.sort((a, b) => b.score - a.score);

    const topScore = data[0].score;
    const tiedScores = data.filter((d) => d.score === topScore);
    const finalResult = tiedScores[Math.floor(Math.random() * tiedScores.length)];

    await firestore.collection('quiz-logs').add({
      minBudget,
      maxBudget,
      cuisine,
      features,
      resultId: finalResult.id,
      resultName: finalResult.name,
      timestampAdded: new Date(),
    });

    // randomly return any with top score
    return [finalResult];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    throw err;
  }
};

const getQuizLogs = async (_: never, { input = {} }: { input?: getQuizLogsInput }): Promise<QuizLog[]> => {
  try {
    const {
      cursor,
    } = input;
    const collectionRef = firestore.collection('quiz-logs');
    let query = collectionRef.orderBy('timestampAdded', 'desc');
    if (cursor) {
      query = query.startAfter(admin.firestore.Timestamp.fromDate(new Date(cursor)));
    }
    query = query.limit(20);

    const documentSnapshots = await query.get();

    // map documentSnapshots to array of objects
    const list: QuizLog[] = [];
    documentSnapshots.forEach((docSnap) => list.push({
      ...docSnap.data(), id: docSnap.id,
    } as QuizLog));

    return list;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    throw err;
  }
};

const addRestaurant = async (_: never, { input }: { input: addRestaurantInput }): Promise<string> => {
  const {
    name,
    address,
    price,
    cuisine,
    features,
  } = input;
  try {
    const topFeatures = Object.entries(features)
      .filter(([, val]) => val > 2).map(([val]) => val);
    const restaurantRes = await firestore.collection('restaurants').add({
      name,
      address,
      price,
      cuisine,
      features,
      topFeatures,
      timestampAdded: new Date(),
      timestampUpdated: new Date(),
    });

    return restaurantRes.id;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    throw err;
  }
};

const editRestaurant = async (_: never, { input }: { input: editRestaurantInput }): Promise<string> => {
  const {
    id,
    name,
    address,
    price,
    cuisine,
    features,
  } = input;
  try {
    const restaurantRef = await firestore.collection('restaurants').doc(id).get();
    if (!restaurantRef.exists) {
      throw new Error(`Could not find restaurant by id ${id}`);
    }

    const topFeatures = Object.entries(features || {})
      .filter(([, val]) => val > 2).map(([val]) => val);

    await restaurantRef.ref.update({
      ...name ? { name } : {},
      ...address ? { address } : {},
      ...typeof price === 'number' ? { price } : {},
      ...cuisine ? { cuisine } : {},
      ...features ? { features, topFeatures } : {},
      timestampUpdated: new Date(),
    });

    return id;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    throw err;
  }
};

const deleteRestaurant = async (_: never, { id }: { id: string }): Promise<string> => {
  try {
    const restaurantRef = await firestore.collection('restaurants').doc(id).get();
    if (!restaurantRef.exists) {
      throw new Error(`Could not find restaurant by id ${id}`);
    }

    await restaurantRef.ref.delete();

    return id;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    throw err;
  }
};

// TODO: clean up
const resolvers = {
  Query: {
    getRestaurant: async (_: never, args: any): Promise<any> => await getRestaurant(_, args),
    getAllRestaurants: async (_: never, args: any): Promise<any> => await getAllRestaurants(_, args),
    getRestaurants: async (_: never, args: any): Promise<any> => await getRestaurants(_, args),
    getQuizLogs: async (_: never, args: any): Promise<any> => await getQuizLogs(_, args),
  },
  Mutation: {
    addRestaurant: async (_: never, args: any): Promise<any> => await addRestaurant(_, args),
    editRestaurant: async (_: never, args: any): Promise<any> => await editRestaurant(_, args),
    deleteRestaurant: async (_: never, args: any): Promise<any> => await deleteRestaurant(_, args),
  },
  Restaurant: {
    timestampAdded: ({ timestampAdded }: Restaurant): Date => timestampAdded.toDate(),
    timestampUpdated: ({ timestampUpdated }: Restaurant): Date => timestampUpdated.toDate(),
  },
  QuizLog: {
    result: async ({ resultId }: QuizLog): Promise<Restaurant> => getRestaurant(null as never, { id: resultId }),
    timestampAdded: ({ timestampAdded }: QuizLog): Date => timestampAdded.toDate(),
  },
  Date: DateScalar,
  Time: TimeScalar,
  DateTime: DateTimeScalar,
};

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: 'bounded',
});
server.start().then(() => {
  server.applyMiddleware({ app, path: '/', cors: true });
}).catch((err) => { throw err; });

exports.graphql = https.onRequest(app);
