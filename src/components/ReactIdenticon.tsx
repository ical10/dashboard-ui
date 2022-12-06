import Identicon from '@polkadot/react-identicon';

type ReactIdenticonProps = {
  address: string;
  size?: number;
};

const ReactIdenticon = ({ address, size = 32 }: ReactIdenticonProps) => {
  return <Identicon value={address} size={size} theme={'polkadot'} />;
};

export default ReactIdenticon;
