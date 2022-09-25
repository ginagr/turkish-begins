import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import admin from 'firebase-admin';
import { https } from 'firebase-functions';

admin.initializeApp();
const firestore = admin.firestore();
firestore.settings({ ignoreUndefinedProperties: true });

enum Cuisine {
  'COUNTRY',
  'NOT_COUNTRY',
  'ANYTHING',
}
interface Features {
  kidFriendly: number,
  vegetarian: number,
  vegan: number,
  view: number,
  instagram: number,
  alcohol: number,
  closeAttractions: number,
  outdoorSeating: number,
  nonSmoking: number,
}
interface Restaurant {
  id: string,
  name: string,
  address: string,
  price: number,
  cuisine: Cuisine,
  features: Features,
  score: number,
  timestampAdded: Date,
  timestampUpdated: Date,
}
interface addRestaurantInput {
  name: string,
  address: string,
  price: number,
  cuisine: Cuisine,
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

const typeDefs = gql`
  type Query {
    getRestaurants(input: GetRestaurantsInput): [Restaurant]!
    getAllRestaurants: [Restaurant]!
  }
  type Mutation {
    addRestaurant(input: AddRestaurantInput!): ID!
  }
  type Restaurant {
    id: ID!
    name: String!
    address: String
    price: Float
    cuisine: String # Cuisine Enum
    features: Features
    score: Float # Temp score for getRestaurants query
    timestampAdded: String
    timestampUpdated: String
  }
  type Features {
    kidFriendly: Int
    vegetarian: Int
    vegan: Int
    view: Int
    instagram: Int
    alcohol: Int
    closeAttractions: Int
    outdoorSeating: Int
    nonSmoking: Int
  }
  input FeaturesInput {
    kidFriendly: Int
    vegetarian: Int
    vegan: Int
    view: Int
    instagram: Int
    alcohol: Int
    closeAttractions: Int
    outdoorSeating: Int
    nonSmoking: Int
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
    features: FeaturesInput
  }
`;

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

    console.log(list);

    return list;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    throw err;
  }
};

// const getRestaurants = async (_: never, { input = {} }: { input?: getRestaurantInput }): Promise<Restaurant[]> => {
const getRestaurants = async (_: never, { input = {} }: { input?: getRestaurantInput }): Promise<Restaurant[]> => {
  try {
    console.log('input', input);
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
      typeof features !== 'undefined'
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

    let query = firestore.collection('restaurants').orderBy('price');
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
      featureKeys.map((key) => {
        query = query.where(key, '>=', 3);
      });
    }
    query = query.orderBy('name');
    query = query.limit(100);

    const queryResults = await query.get();

    const data: Restaurant[] = [];
    queryResults.forEach((queryDoc) => {
      const restaurant = queryDoc.data() as Restaurant;
      restaurant.id = queryDoc.id;
      if (!featureLength) {
        // todo: compute score based on all features?
        restaurant.score = 1;
        data.push(restaurant);
        return;
      }

      const cumulativeScore = featureKeys.reduce((acc, curr) => {
        const restaurantFeature = restaurant.features[curr as keyof Features];
        return acc + restaurantFeature;
      }, 0);

      restaurant.score = +(cumulativeScore / featureLength).toFixed(2);
      data.push(restaurant);
    });

    data.sort((a, b) => a.score - b.score);
    console.log(data);

    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    throw err;
  }
};

const addRestaurant = async (_: never, { input }: { input: addRestaurantInput }): Promise<string> => {
  console.log(input);
  const {
    name,
    address,
    price,
    cuisine,
    features,
  } = input;
  try {
    const restaurantRes = await firestore.collection('restaurants').add({
      name,
      address,
      price,
      cuisine,
      features,
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

const resolvers = {
  Query: {
    getAllRestaurants: async (_: never, args: any): Promise<any> => await getAllRestaurants(_, args),
    getRestaurants: async (_: never, args: any): Promise<any> => await getRestaurants(_, args),
  },
  Mutation: {
    addRestaurant: async (_: never, args: any): Promise<any> => await addRestaurant(_, args),
  },
  // Restaurant: {
  //   timestampAdded: ({ timestampAdded: Timestamp }) => new Date(timestampAdded).
  // }
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  server.applyMiddleware({ app, path: '/', cors: true });
}).catch((err) => { throw err; });

exports.graphql = https.onRequest(app);
