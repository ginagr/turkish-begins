import { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { Popup } from 'reactjs-popup';
import './popup.scss';

interface Props {
  openPopup: boolean,
  setOpenPopup: Dispatch<SetStateAction<boolean>>,
  hideFooter?: boolean,
  onAction?: () => void,
  size?: number,
  children: ReactNode,
}

const PopupComponent: FC<Props> = (props) => {
  const {
    openPopup,
    setOpenPopup,
    hideFooter,
    onAction,
    size,
    children,
  } = props;

  return (
    <Popup
      open={openPopup}
      onClose={(): void => setOpenPopup(false)}
      closeOnDocumentClick
      contentStyle={{
        ...size ? {
          width: `${size}vw`,
        } : {},
      }}
    >
      {children}
      {!hideFooter && (
        <div className="popup-footer row justify-content-center">
          <div className="col-12 col-md-auto">
            <button className="btn btn-secondary" onClick={(): void => setOpenPopup(false)}>
            Cancel
            </button>
          </div>
          <div className="col-12 col-md-auto">
            <button className="btn btn-primary" onClick={onAction}>
            Confirm
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default PopupComponent;
