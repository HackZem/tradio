import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type CategoryModel = {
  __typename?: 'CategoryModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lots: Array<LotModel>;
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ChangeLotInfoInput = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  condition?: InputMaybe<ConditionType>;
  country?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['JSON']['input']>;
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  firstPrice?: InputMaybe<Scalars['Float']['input']>;
  lotId: Scalars['String']['input'];
  returnPeriod?: InputMaybe<ReturnType>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<LotType>;
};

export type ChangeProfileInfoInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export enum ConditionType {
  Defective = 'DEFECTIVE',
  New = 'NEW',
  Used = 'USED'
}

export type CreateLotInput = {
  categoryId: Scalars['String']['input'];
  city: Scalars['String']['input'];
  condition: ConditionType;
  country: Scalars['String']['input'];
  description?: InputMaybe<Scalars['JSON']['input']>;
  expiresAt: Scalars['DateTime']['input'];
  firstPrice: Scalars['Float']['input'];
  returnPeriod: ReturnType;
  title: Scalars['String']['input'];
  type: LotType;
};

export type CreateUserInput = {
  confirmPassword: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type DeviceModel = {
  __typename?: 'DeviceModel';
  browser: Scalars['String']['output'];
  os: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type FiltersInput = {
  categoryIds?: InputMaybe<Array<Scalars['String']['input']>>;
  city?: InputMaybe<Scalars['String']['input']>;
  condition?: InputMaybe<Array<ConditionType>>;
  country?: InputMaybe<Scalars['String']['input']>;
  lotTypes?: InputMaybe<Array<LotType>>;
  priceRange?: InputMaybe<PriceRangeInput>;
  query?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Float']['input']>;
  sortBy?: InputMaybe<SortBy>;
  sortOrder?: InputMaybe<SortOrder>;
  take?: InputMaybe<Scalars['Float']['input']>;
};

export type LocationModel = {
  __typename?: 'LocationModel';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  latidute: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type LoginInput = {
  login: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LotModel = {
  __typename?: 'LotModel';
  buyNowPrice?: Maybe<Scalars['Float']['output']>;
  category: CategoryModel;
  categoryId: Scalars['String']['output'];
  city: Scalars['String']['output'];
  condition: ConditionType;
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  currentPrice?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['JSON']['output']>;
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  firstPrice?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  photos: Array<Scalars['String']['output']>;
  returnPeriod: ReturnType;
  subscriptions: Array<LotSubscriptionModel>;
  title: Scalars['String']['output'];
  type: LotType;
  updatedAt: Scalars['DateTime']['output'];
  user: UserModel;
  userId: Scalars['String']['output'];
  views: Scalars['Float']['output'];
};

export type LotSubscriptionModel = {
  __typename?: 'LotSubscriptionModel';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  lot: LotModel;
  lotId: Scalars['String']['output'];
  user: UserModel;
  userId: Scalars['String']['output'];
};

export enum LotType {
  Auction = 'AUCTION',
  Buynow = 'BUYNOW',
  Mixed = 'MIXED'
}

export type Mutation = {
  __typename?: 'Mutation';
  changeLotInfo: Scalars['Boolean']['output'];
  changeProfileAvatar: Scalars['Boolean']['output'];
  changeProfileInfo: Scalars['Boolean']['output'];
  clearSessionCookie: Scalars['Boolean']['output'];
  createLot: Scalars['Boolean']['output'];
  createUser: Scalars['Boolean']['output'];
  login: UserModel;
  logout: Scalars['Boolean']['output'];
  placeBid: Scalars['Boolean']['output'];
  removePhotoFromLot: Scalars['Boolean']['output'];
  removeProfileAvatar: Scalars['Boolean']['output'];
  removeSession: Scalars['Boolean']['output'];
  reorderPhotosInLot: Scalars['Boolean']['output'];
  subscribeToLot: Scalars['Boolean']['output'];
  unsubscribeFromLot: Scalars['Boolean']['output'];
  uploadPhotoToLot: Scalars['Boolean']['output'];
  verifyAccount: UserModel;
};


export type MutationChangeLotInfoArgs = {
  data: ChangeLotInfoInput;
};


export type MutationChangeProfileAvatarArgs = {
  avatar: Scalars['Upload']['input'];
};


export type MutationChangeProfileInfoArgs = {
  data: ChangeProfileInfoInput;
};


export type MutationCreateLotArgs = {
  data: CreateLotInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationPlaceBidArgs = {
  data: PlaceBidInput;
};


export type MutationRemovePhotoFromLotArgs = {
  data: RemovePhotoInput;
};


export type MutationRemoveSessionArgs = {
  id: Scalars['String']['input'];
};


export type MutationReorderPhotosInLotArgs = {
  data: ReorderPhotosInput;
};


export type MutationSubscribeToLotArgs = {
  lotId: Scalars['String']['input'];
};


export type MutationUnsubscribeFromLotArgs = {
  lotId: Scalars['String']['input'];
};


export type MutationUploadPhotoToLotArgs = {
  data: UploadPhotoInput;
  file: Scalars['Upload']['input'];
};


export type MutationVerifyAccountArgs = {
  data: VerificationInput;
};

export type NotificationModel = {
  __typename?: 'NotificationModel';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  type: NotificationType;
  user: UserModel;
  userId: Scalars['String']['output'];
};

export enum NotificationType {
  LotEnded = 'LOT_ENDED',
  LotEnding = 'LOT_ENDING',
  LotLost = 'LOT_LOST',
  LotWon = 'LOT_WON',
  NewBid = 'NEW_BID',
  Other = 'OTHER',
  Outbid = 'OUTBID'
}

export type PlaceBidInput = {
  amount: Scalars['Float']['input'];
  lotId: Scalars['String']['input'];
};

export type PriceRangeInput = {
  max?: InputMaybe<Scalars['Float']['input']>;
  min?: InputMaybe<Scalars['Float']['input']>;
};

export type Query = {
  __typename?: 'Query';
  findAllCategories: Array<CategoryModel>;
  findAllLots: Array<LotModel>;
  findCurrentSession: SessionModel;
  findLastBid: Scalars['Boolean']['output'];
  findLotById: LotModel;
  findOtherSessionsByUser: Array<SessionModel>;
  findProfile: UserModel;
};


export type QueryFindAllLotsArgs = {
  filters: FiltersInput;
};


export type QueryFindLastBidArgs = {
  lotId: Scalars['String']['input'];
};


export type QueryFindLotByIdArgs = {
  id: Scalars['String']['input'];
};

export type RemovePhotoInput = {
  lotId: Scalars['String']['input'];
  photoKey: Scalars['String']['input'];
};

export type ReorderPhotosInput = {
  lotId: Scalars['String']['input'];
  photoKeys: Array<Scalars['String']['input']>;
};

export enum ReturnType {
  NonReturnable = 'NON_RETURNABLE',
  Period_7D = 'PERIOD_7D',
  Period_14D = 'PERIOD_14D',
  Period_30D = 'PERIOD_30D'
}

export type SessionMetadataModel = {
  __typename?: 'SessionMetadataModel';
  device: DeviceModel;
  ip: Scalars['String']['output'];
  location: LocationModel;
};

export type SessionModel = {
  __typename?: 'SessionModel';
  createAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  metadata: SessionMetadataModel;
  userId: Scalars['String']['output'];
};

export enum SortBy {
  Bids = 'BIDS',
  CreatedAt = 'CREATED_AT',
  ExpiresAt = 'EXPIRES_AT',
  Price = 'PRICE'
}

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type UploadPhotoInput = {
  lotId: Scalars['String']['input'];
};

export type UserModel = {
  __typename?: 'UserModel';
  avatar?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  lots: Array<LotModel>;
  notifications: Array<NotificationModel>;
  password: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  subscriptions: Array<LotSubscriptionModel>;
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type VerificationInput = {
  token: Scalars['String']['input'];
};

export type CreateUserMutationVariables = Exact<{
  data: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: boolean };

export type FindAllLotsQueryVariables = Exact<{
  filters: FiltersInput;
}>;


export type FindAllLotsQuery = { __typename?: 'Query', findAllLots: Array<{ __typename?: 'LotModel', id: string, title: string, currentPrice?: number | null, country: string, user: { __typename?: 'UserModel', username: string } }> };


export const CreateUserDocument = gql`
    mutation CreateUser($data: CreateUserInput!) {
  createUser(data: $data)
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const FindAllLotsDocument = gql`
    query FindAllLots($filters: FiltersInput!) {
  findAllLots(filters: $filters) {
    id
    title
    currentPrice
    country
    user {
      username
    }
  }
}
    `;

/**
 * __useFindAllLotsQuery__
 *
 * To run a query within a React component, call `useFindAllLotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindAllLotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindAllLotsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useFindAllLotsQuery(baseOptions: Apollo.QueryHookOptions<FindAllLotsQuery, FindAllLotsQueryVariables> & ({ variables: FindAllLotsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindAllLotsQuery, FindAllLotsQueryVariables>(FindAllLotsDocument, options);
      }
export function useFindAllLotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindAllLotsQuery, FindAllLotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindAllLotsQuery, FindAllLotsQueryVariables>(FindAllLotsDocument, options);
        }
export function useFindAllLotsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindAllLotsQuery, FindAllLotsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindAllLotsQuery, FindAllLotsQueryVariables>(FindAllLotsDocument, options);
        }
export type FindAllLotsQueryHookResult = ReturnType<typeof useFindAllLotsQuery>;
export type FindAllLotsLazyQueryHookResult = ReturnType<typeof useFindAllLotsLazyQuery>;
export type FindAllLotsSuspenseQueryHookResult = ReturnType<typeof useFindAllLotsSuspenseQuery>;
export type FindAllLotsQueryResult = Apollo.QueryResult<FindAllLotsQuery, FindAllLotsQueryVariables>;