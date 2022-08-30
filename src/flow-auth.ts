import * as fcl from '@onflow/fcl';
import { ec as EC } from 'elliptic';
import { SHA3 } from 'sha3';
const ec: EC = new EC('p256');

const hashMsg = (msg: string) => {
  const sha = new SHA3(256);
  sha.update(Buffer.from(msg, 'hex'));
  return sha.digest();
};

const signWithKey = (privateKey: string, msg: string) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, 'hex'));
  const sig = key.sign(hashMsg(msg));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, 'be', n);
  const s = sig.s.toArrayLike(Buffer, 'be', n);
  return Buffer.concat([r, s]).toString('hex');
};

export const authorizationFunction = () => {
  return async (account: any = {}) => {
    const data = await fcl.send([fcl.getAccount('01cf0e2f2f715450')]);
    const user = data.account;
    const key = user.keys[0];

    const pk =
      'd30728757a139fcbb33d28fe922c27e3febaf969272bdafde5f0a86291aec25c';
    const sign = signWithKey;

    return {
      ...account,
      tempId: `${user.address}-${key.index}`,
      addr: fcl.sansPrefix(user.address),
      keyId: Number(key.index),
      signingFunction: (signable) => {
        return {
          addr: fcl.withPrefix(user.address),
          keyId: Number(key.index),
          signature: sign(pk, signable.message),
        };
      },
    };
  };
};
