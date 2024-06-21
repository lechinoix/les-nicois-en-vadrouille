/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A high precision floating point value represented as a string */
  BigFloat: { input: string; output: string; }
  /** An arbitrary size integer represented as a string */
  BigInt: { input: string; output: string; }
  /** An opaque string using for tracking a position in results during pagination */
  Cursor: { input: any; output: any; }
  /** A date wihout time information */
  Date: { input: string; output: string; }
  /** A date and time */
  Datetime: { input: string; output: string; }
  /** A Javascript Object Notation value serialized as a string */
  JSON: { input: string; output: string; }
  /** Any type not handled by the type system */
  Opaque: { input: any; output: any; }
  /** A time without date information */
  Time: { input: string; output: string; }
  /** A universally unique identifier */
  UUID: { input: string; output: string; }
};

/** Boolean expression comparing fields on type "BigFloat" */
export type BigFloatFilter = {
  eq?: InputMaybe<Scalars['BigFloat']['input']>;
  gt?: InputMaybe<Scalars['BigFloat']['input']>;
  gte?: InputMaybe<Scalars['BigFloat']['input']>;
  in?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['BigFloat']['input']>;
  lte?: InputMaybe<Scalars['BigFloat']['input']>;
  neq?: InputMaybe<Scalars['BigFloat']['input']>;
};

/** Boolean expression comparing fields on type "BigInt" */
export type BigIntFilter = {
  eq?: InputMaybe<Scalars['BigInt']['input']>;
  gt?: InputMaybe<Scalars['BigInt']['input']>;
  gte?: InputMaybe<Scalars['BigInt']['input']>;
  in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['BigInt']['input']>;
  lte?: InputMaybe<Scalars['BigInt']['input']>;
  neq?: InputMaybe<Scalars['BigInt']['input']>;
};

/** Boolean expression comparing fields on type "Boolean" */
export type BooleanFilter = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  is?: InputMaybe<FilterIs>;
};

/** Boolean expression comparing fields on type "Date" */
export type DateFilter = {
  eq?: InputMaybe<Scalars['Date']['input']>;
  gt?: InputMaybe<Scalars['Date']['input']>;
  gte?: InputMaybe<Scalars['Date']['input']>;
  in?: InputMaybe<Array<Scalars['Date']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Date']['input']>;
  lte?: InputMaybe<Scalars['Date']['input']>;
  neq?: InputMaybe<Scalars['Date']['input']>;
};

/** Boolean expression comparing fields on type "Datetime" */
export type DatetimeFilter = {
  eq?: InputMaybe<Scalars['Datetime']['input']>;
  gt?: InputMaybe<Scalars['Datetime']['input']>;
  gte?: InputMaybe<Scalars['Datetime']['input']>;
  in?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Datetime']['input']>;
  lte?: InputMaybe<Scalars['Datetime']['input']>;
  neq?: InputMaybe<Scalars['Datetime']['input']>;
};

export enum FilterIs {
  NotNull = 'NOT_NULL',
  Null = 'NULL'
}

/** Boolean expression comparing fields on type "Float" */
export type FloatFilter = {
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  neq?: InputMaybe<Scalars['Float']['input']>;
};

/** Boolean expression comparing fields on type "ID" */
export type IdFilter = {
  eq?: InputMaybe<Scalars['ID']['input']>;
};

/** Boolean expression comparing fields on type "Int" */
export type IntFilter = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
};

/** The root type for creating and mutating data */
export type Mutation = {
  __typename?: 'Mutation';
  /** Deletes zero or more records from the `image` collection */
  deleteFromimageCollection: ImageDeleteResponse;
  /** Deletes zero or more records from the `image_format` collection */
  deleteFromimage_formatCollection: Image_FormatDeleteResponse;
  /** Deletes zero or more records from the `outing` collection */
  deleteFromoutingCollection: OutingDeleteResponse;
  /** Deletes zero or more records from the `outing_image` collection */
  deleteFromouting_imageCollection: Outing_ImageDeleteResponse;
  /** Deletes zero or more records from the `outing_participant` collection */
  deleteFromouting_participantCollection: Outing_ParticipantDeleteResponse;
  /** Deletes zero or more records from the `outing_period` collection */
  deleteFromouting_periodCollection: Outing_PeriodDeleteResponse;
  /** Deletes zero or more records from the `outing_place` collection */
  deleteFromouting_placeCollection: Outing_PlaceDeleteResponse;
  /** Deletes zero or more records from the `outing_sport` collection */
  deleteFromouting_sportCollection: Outing_SportDeleteResponse;
  /** Deletes zero or more records from the `participant` collection */
  deleteFromparticipantCollection: ParticipantDeleteResponse;
  /** Deletes zero or more records from the `period` collection */
  deleteFromperiodCollection: PeriodDeleteResponse;
  /** Deletes zero or more records from the `place` collection */
  deleteFromplaceCollection: PlaceDeleteResponse;
  /** Deletes zero or more records from the `sport` collection */
  deleteFromsportCollection: SportDeleteResponse;
  /** Adds one or more `image` records to the collection */
  insertIntoimageCollection?: Maybe<ImageInsertResponse>;
  /** Adds one or more `image_format` records to the collection */
  insertIntoimage_formatCollection?: Maybe<Image_FormatInsertResponse>;
  /** Adds one or more `outing` records to the collection */
  insertIntooutingCollection?: Maybe<OutingInsertResponse>;
  /** Adds one or more `outing_image` records to the collection */
  insertIntoouting_imageCollection?: Maybe<Outing_ImageInsertResponse>;
  /** Adds one or more `outing_participant` records to the collection */
  insertIntoouting_participantCollection?: Maybe<Outing_ParticipantInsertResponse>;
  /** Adds one or more `outing_period` records to the collection */
  insertIntoouting_periodCollection?: Maybe<Outing_PeriodInsertResponse>;
  /** Adds one or more `outing_place` records to the collection */
  insertIntoouting_placeCollection?: Maybe<Outing_PlaceInsertResponse>;
  /** Adds one or more `outing_sport` records to the collection */
  insertIntoouting_sportCollection?: Maybe<Outing_SportInsertResponse>;
  /** Adds one or more `participant` records to the collection */
  insertIntoparticipantCollection?: Maybe<ParticipantInsertResponse>;
  /** Adds one or more `period` records to the collection */
  insertIntoperiodCollection?: Maybe<PeriodInsertResponse>;
  /** Adds one or more `place` records to the collection */
  insertIntoplaceCollection?: Maybe<PlaceInsertResponse>;
  /** Adds one or more `sport` records to the collection */
  insertIntosportCollection?: Maybe<SportInsertResponse>;
  /** Updates zero or more records in the `image` collection */
  updateimageCollection: ImageUpdateResponse;
  /** Updates zero or more records in the `image_format` collection */
  updateimage_formatCollection: Image_FormatUpdateResponse;
  /** Updates zero or more records in the `outing` collection */
  updateoutingCollection: OutingUpdateResponse;
  /** Updates zero or more records in the `outing_image` collection */
  updateouting_imageCollection: Outing_ImageUpdateResponse;
  /** Updates zero or more records in the `outing_participant` collection */
  updateouting_participantCollection: Outing_ParticipantUpdateResponse;
  /** Updates zero or more records in the `outing_period` collection */
  updateouting_periodCollection: Outing_PeriodUpdateResponse;
  /** Updates zero or more records in the `outing_place` collection */
  updateouting_placeCollection: Outing_PlaceUpdateResponse;
  /** Updates zero or more records in the `outing_sport` collection */
  updateouting_sportCollection: Outing_SportUpdateResponse;
  /** Updates zero or more records in the `participant` collection */
  updateparticipantCollection: ParticipantUpdateResponse;
  /** Updates zero or more records in the `period` collection */
  updateperiodCollection: PeriodUpdateResponse;
  /** Updates zero or more records in the `place` collection */
  updateplaceCollection: PlaceUpdateResponse;
  /** Updates zero or more records in the `sport` collection */
  updatesportCollection: SportUpdateResponse;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromimageCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<ImageFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromimage_FormatCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Image_FormatFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromoutingCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<OutingFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromouting_ImageCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Outing_ImageFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromouting_ParticipantCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Outing_ParticipantFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromouting_PeriodCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Outing_PeriodFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromouting_PlaceCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Outing_PlaceFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromouting_SportCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Outing_SportFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromparticipantCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<ParticipantFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromperiodCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<PeriodFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromplaceCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<PlaceFilter>;
};


/** The root type for creating and mutating data */
export type MutationDeleteFromsportCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<SportFilter>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoimageCollectionArgs = {
  objects: Array<ImageInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoimage_FormatCollectionArgs = {
  objects: Array<Image_FormatInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntooutingCollectionArgs = {
  objects: Array<OutingInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoouting_ImageCollectionArgs = {
  objects: Array<Outing_ImageInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoouting_ParticipantCollectionArgs = {
  objects: Array<Outing_ParticipantInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoouting_PeriodCollectionArgs = {
  objects: Array<Outing_PeriodInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoouting_PlaceCollectionArgs = {
  objects: Array<Outing_PlaceInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoouting_SportCollectionArgs = {
  objects: Array<Outing_SportInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoparticipantCollectionArgs = {
  objects: Array<ParticipantInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoperiodCollectionArgs = {
  objects: Array<PeriodInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntoplaceCollectionArgs = {
  objects: Array<PlaceInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationInsertIntosportCollectionArgs = {
  objects: Array<SportInsertInput>;
};


/** The root type for creating and mutating data */
export type MutationUpdateimageCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<ImageFilter>;
  set: ImageUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateimage_FormatCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Image_FormatFilter>;
  set: Image_FormatUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateoutingCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<OutingFilter>;
  set: OutingUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateouting_ImageCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Outing_ImageFilter>;
  set: Outing_ImageUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateouting_ParticipantCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Outing_ParticipantFilter>;
  set: Outing_ParticipantUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateouting_PeriodCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Outing_PeriodFilter>;
  set: Outing_PeriodUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateouting_PlaceCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Outing_PlaceFilter>;
  set: Outing_PlaceUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateouting_SportCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<Outing_SportFilter>;
  set: Outing_SportUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateparticipantCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<ParticipantFilter>;
  set: ParticipantUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateperiodCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<PeriodFilter>;
  set: PeriodUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdateplaceCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<PlaceFilter>;
  set: PlaceUpdateInput;
};


/** The root type for creating and mutating data */
export type MutationUpdatesportCollectionArgs = {
  atMost?: Scalars['Int']['input'];
  filter?: InputMaybe<SportFilter>;
  set: SportUpdateInput;
};

export type Node = {
  /** Retrieves a record by `ID` */
  nodeId: Scalars['ID']['output'];
};

/** Boolean expression comparing fields on type "Opaque" */
export type OpaqueFilter = {
  eq?: InputMaybe<Scalars['Opaque']['input']>;
  is?: InputMaybe<FilterIs>;
};

/** Defines a per-field sorting order */
export enum OrderByDirection {
  /** Ascending order, nulls first */
  AscNullsFirst = 'AscNullsFirst',
  /** Ascending order, nulls last */
  AscNullsLast = 'AscNullsLast',
  /** Descending order, nulls first */
  DescNullsFirst = 'DescNullsFirst',
  /** Descending order, nulls last */
  DescNullsLast = 'DescNullsLast'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

/** The root type for querying data */
export type Query = {
  __typename?: 'Query';
  /** A pagable collection of type `image` */
  imageCollection?: Maybe<ImageConnection>;
  /** A pagable collection of type `image_format` */
  image_formatCollection?: Maybe<Image_FormatConnection>;
  /** Retrieve a record by its `ID` */
  node?: Maybe<Node>;
  /** A pagable collection of type `outing` */
  outingCollection?: Maybe<OutingConnection>;
  /** A pagable collection of type `outing_image` */
  outing_imageCollection?: Maybe<Outing_ImageConnection>;
  /** A pagable collection of type `outing_participant` */
  outing_participantCollection?: Maybe<Outing_ParticipantConnection>;
  /** A pagable collection of type `outing_period` */
  outing_periodCollection?: Maybe<Outing_PeriodConnection>;
  /** A pagable collection of type `outing_place` */
  outing_placeCollection?: Maybe<Outing_PlaceConnection>;
  /** A pagable collection of type `outing_sport` */
  outing_sportCollection?: Maybe<Outing_SportConnection>;
  /** A pagable collection of type `participant` */
  participantCollection?: Maybe<ParticipantConnection>;
  /** A pagable collection of type `period` */
  periodCollection?: Maybe<PeriodConnection>;
  /** A pagable collection of type `place` */
  placeCollection?: Maybe<PlaceConnection>;
  /** A pagable collection of type `sport` */
  sportCollection?: Maybe<SportConnection>;
};


/** The root type for querying data */
export type QueryImageCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ImageFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ImageOrderBy>>;
};


/** The root type for querying data */
export type QueryImage_FormatCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Image_FormatFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Image_FormatOrderBy>>;
};


/** The root type for querying data */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root type for querying data */
export type QueryOutingCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<OutingFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<OutingOrderBy>>;
};


/** The root type for querying data */
export type QueryOuting_ImageCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Outing_ImageFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Outing_ImageOrderBy>>;
};


/** The root type for querying data */
export type QueryOuting_ParticipantCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Outing_ParticipantFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Outing_ParticipantOrderBy>>;
};


/** The root type for querying data */
export type QueryOuting_PeriodCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Outing_PeriodFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Outing_PeriodOrderBy>>;
};


/** The root type for querying data */
export type QueryOuting_PlaceCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Outing_PlaceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Outing_PlaceOrderBy>>;
};


/** The root type for querying data */
export type QueryOuting_SportCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Outing_SportFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Outing_SportOrderBy>>;
};


/** The root type for querying data */
export type QueryParticipantCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<ParticipantFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ParticipantOrderBy>>;
};


/** The root type for querying data */
export type QueryPeriodCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<PeriodFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PeriodOrderBy>>;
};


/** The root type for querying data */
export type QueryPlaceCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<PlaceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PlaceOrderBy>>;
};


/** The root type for querying data */
export type QuerySportCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<SportFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SportOrderBy>>;
};

/** Boolean expression comparing fields on type "String" */
export type StringFilter = {
  eq?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  ilike?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  iregex?: InputMaybe<Scalars['String']['input']>;
  is?: InputMaybe<FilterIs>;
  like?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  regex?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression comparing fields on type "Time" */
export type TimeFilter = {
  eq?: InputMaybe<Scalars['Time']['input']>;
  gt?: InputMaybe<Scalars['Time']['input']>;
  gte?: InputMaybe<Scalars['Time']['input']>;
  in?: InputMaybe<Array<Scalars['Time']['input']>>;
  is?: InputMaybe<FilterIs>;
  lt?: InputMaybe<Scalars['Time']['input']>;
  lte?: InputMaybe<Scalars['Time']['input']>;
  neq?: InputMaybe<Scalars['Time']['input']>;
};

/** Boolean expression comparing fields on type "UUID" */
export type UuidFilter = {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<Scalars['UUID']['input']>>;
  is?: InputMaybe<FilterIs>;
  neq?: InputMaybe<Scalars['UUID']['input']>;
};

export type Image = Node & {
  __typename?: 'image';
  created_at: Scalars['Datetime']['output'];
  height?: Maybe<Scalars['BigInt']['output']>;
  id: Scalars['String']['output'];
  image_formatCollection?: Maybe<Image_FormatConnection>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  outingCollection?: Maybe<OutingConnection>;
  outing_imageCollection?: Maybe<Outing_ImageConnection>;
  url: Scalars['String']['output'];
  width?: Maybe<Scalars['BigInt']['output']>;
};


export type ImageImage_FormatCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Image_FormatFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Image_FormatOrderBy>>;
};


export type ImageOutingCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<OutingFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<OutingOrderBy>>;
};


export type ImageOuting_ImageCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Outing_ImageFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Outing_ImageOrderBy>>;
};

export type ImageConnection = {
  __typename?: 'imageConnection';
  edges: Array<ImageEdge>;
  pageInfo: PageInfo;
};

export type ImageDeleteResponse = {
  __typename?: 'imageDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Image>;
};

export type ImageEdge = {
  __typename?: 'imageEdge';
  cursor: Scalars['String']['output'];
  node: Image;
};

export type ImageFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<ImageFilter>>;
  created_at?: InputMaybe<DatetimeFilter>;
  height?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<ImageFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<ImageFilter>>;
  url?: InputMaybe<StringFilter>;
  width?: InputMaybe<BigIntFilter>;
};

export type ImageInsertInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  height?: InputMaybe<Scalars['BigInt']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  width?: InputMaybe<Scalars['BigInt']['input']>;
};

export type ImageInsertResponse = {
  __typename?: 'imageInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Image>;
};

export type ImageOrderBy = {
  created_at?: InputMaybe<OrderByDirection>;
  height?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  url?: InputMaybe<OrderByDirection>;
  width?: InputMaybe<OrderByDirection>;
};

export type ImageUpdateInput = {
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  height?: InputMaybe<Scalars['BigInt']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  width?: InputMaybe<Scalars['BigInt']['input']>;
};

export type ImageUpdateResponse = {
  __typename?: 'imageUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Image>;
};

export type Image_Format = Node & {
  __typename?: 'image_format';
  format: Scalars['String']['output'];
  height?: Maybe<Scalars['BigInt']['output']>;
  id: Scalars['String']['output'];
  image: Image;
  image_id: Scalars['String']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  url: Scalars['String']['output'];
  width?: Maybe<Scalars['BigInt']['output']>;
};

export type Image_FormatConnection = {
  __typename?: 'image_formatConnection';
  edges: Array<Image_FormatEdge>;
  pageInfo: PageInfo;
};

export type Image_FormatDeleteResponse = {
  __typename?: 'image_formatDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Image_Format>;
};

export type Image_FormatEdge = {
  __typename?: 'image_formatEdge';
  cursor: Scalars['String']['output'];
  node: Image_Format;
};

export type Image_FormatFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Image_FormatFilter>>;
  format?: InputMaybe<StringFilter>;
  height?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<StringFilter>;
  image_id?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Image_FormatFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Image_FormatFilter>>;
  url?: InputMaybe<StringFilter>;
  width?: InputMaybe<BigIntFilter>;
};

export type Image_FormatInsertInput = {
  format?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['BigInt']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  image_id?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  width?: InputMaybe<Scalars['BigInt']['input']>;
};

export type Image_FormatInsertResponse = {
  __typename?: 'image_formatInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Image_Format>;
};

export type Image_FormatOrderBy = {
  format?: InputMaybe<OrderByDirection>;
  height?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  image_id?: InputMaybe<OrderByDirection>;
  url?: InputMaybe<OrderByDirection>;
  width?: InputMaybe<OrderByDirection>;
};

export type Image_FormatUpdateInput = {
  format?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['BigInt']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  image_id?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  width?: InputMaybe<Scalars['BigInt']['input']>;
};

export type Image_FormatUpdateResponse = {
  __typename?: 'image_formatUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Image_Format>;
};

export type Outing = Node & {
  __typename?: 'outing';
  content?: Maybe<Scalars['String']['output']>;
  cotation?: Maybe<Scalars['String']['output']>;
  cover_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['Datetime']['output'];
  date?: Maybe<Scalars['Date']['output']>;
  elevation?: Maybe<Scalars['BigInt']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Image>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  orientation?: Maybe<Scalars['String']['output']>;
  outing_imageCollection?: Maybe<Outing_ImageConnection>;
  outing_participantCollection?: Maybe<Outing_ParticipantConnection>;
  outing_periodCollection?: Maybe<Outing_PeriodConnection>;
  outing_placeCollection?: Maybe<Outing_PlaceConnection>;
  outing_sportCollection?: Maybe<Outing_SportConnection>;
  status?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  topos?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};


export type OutingOuting_ImageCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Outing_ImageFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Outing_ImageOrderBy>>;
};


export type OutingOuting_ParticipantCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Outing_ParticipantFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Outing_ParticipantOrderBy>>;
};


export type OutingOuting_PeriodCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Outing_PeriodFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Outing_PeriodOrderBy>>;
};


export type OutingOuting_PlaceCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Outing_PlaceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Outing_PlaceOrderBy>>;
};


export type OutingOuting_SportCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Outing_SportFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Outing_SportOrderBy>>;
};

export type OutingConnection = {
  __typename?: 'outingConnection';
  edges: Array<OutingEdge>;
  pageInfo: PageInfo;
};

export type OutingDeleteResponse = {
  __typename?: 'outingDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing>;
};

export type OutingEdge = {
  __typename?: 'outingEdge';
  cursor: Scalars['String']['output'];
  node: Outing;
};

export type OutingFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<OutingFilter>>;
  content?: InputMaybe<StringFilter>;
  cotation?: InputMaybe<StringFilter>;
  cover_id?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DatetimeFilter>;
  date?: InputMaybe<DateFilter>;
  elevation?: InputMaybe<BigIntFilter>;
  id?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<OutingFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<OutingFilter>>;
  orientation?: InputMaybe<StringFilter>;
  status?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
};

export type OutingInsertInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  cotation?: InputMaybe<Scalars['String']['input']>;
  cover_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
  elevation?: InputMaybe<Scalars['BigInt']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  orientation?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  topos?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type OutingInsertResponse = {
  __typename?: 'outingInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing>;
};

export type OutingOrderBy = {
  content?: InputMaybe<OrderByDirection>;
  cotation?: InputMaybe<OrderByDirection>;
  cover_id?: InputMaybe<OrderByDirection>;
  created_at?: InputMaybe<OrderByDirection>;
  date?: InputMaybe<OrderByDirection>;
  elevation?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  orientation?: InputMaybe<OrderByDirection>;
  status?: InputMaybe<OrderByDirection>;
  title?: InputMaybe<OrderByDirection>;
};

export type OutingUpdateInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  cotation?: InputMaybe<Scalars['String']['input']>;
  cover_id?: InputMaybe<Scalars['String']['input']>;
  created_at?: InputMaybe<Scalars['Datetime']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
  elevation?: InputMaybe<Scalars['BigInt']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  orientation?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  topos?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type OutingUpdateResponse = {
  __typename?: 'outingUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing>;
};

export type Outing_Image = Node & {
  __typename?: 'outing_image';
  image: Image;
  image_id: Scalars['String']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  outing: Outing;
  outing_id: Scalars['String']['output'];
};

export type Outing_ImageConnection = {
  __typename?: 'outing_imageConnection';
  edges: Array<Outing_ImageEdge>;
  pageInfo: PageInfo;
};

export type Outing_ImageDeleteResponse = {
  __typename?: 'outing_imageDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing_Image>;
};

export type Outing_ImageEdge = {
  __typename?: 'outing_imageEdge';
  cursor: Scalars['String']['output'];
  node: Outing_Image;
};

export type Outing_ImageFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Outing_ImageFilter>>;
  image_id?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Outing_ImageFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Outing_ImageFilter>>;
  outing_id?: InputMaybe<StringFilter>;
};

export type Outing_ImageInsertInput = {
  image_id?: InputMaybe<Scalars['String']['input']>;
  outing_id?: InputMaybe<Scalars['String']['input']>;
};

export type Outing_ImageInsertResponse = {
  __typename?: 'outing_imageInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing_Image>;
};

export type Outing_ImageOrderBy = {
  image_id?: InputMaybe<OrderByDirection>;
  outing_id?: InputMaybe<OrderByDirection>;
};

export type Outing_ImageUpdateInput = {
  image_id?: InputMaybe<Scalars['String']['input']>;
  outing_id?: InputMaybe<Scalars['String']['input']>;
};

export type Outing_ImageUpdateResponse = {
  __typename?: 'outing_imageUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing_Image>;
};

export type Outing_Participant = Node & {
  __typename?: 'outing_participant';
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  outing: Outing;
  outing_id: Scalars['String']['output'];
  participant: Participant;
  participant_id: Scalars['String']['output'];
};

export type Outing_ParticipantConnection = {
  __typename?: 'outing_participantConnection';
  edges: Array<Outing_ParticipantEdge>;
  pageInfo: PageInfo;
};

export type Outing_ParticipantDeleteResponse = {
  __typename?: 'outing_participantDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing_Participant>;
};

export type Outing_ParticipantEdge = {
  __typename?: 'outing_participantEdge';
  cursor: Scalars['String']['output'];
  node: Outing_Participant;
};

export type Outing_ParticipantFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Outing_ParticipantFilter>>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Outing_ParticipantFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Outing_ParticipantFilter>>;
  outing_id?: InputMaybe<StringFilter>;
  participant_id?: InputMaybe<StringFilter>;
};

export type Outing_ParticipantInsertInput = {
  outing_id?: InputMaybe<Scalars['String']['input']>;
  participant_id?: InputMaybe<Scalars['String']['input']>;
};

export type Outing_ParticipantInsertResponse = {
  __typename?: 'outing_participantInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing_Participant>;
};

export type Outing_ParticipantOrderBy = {
  outing_id?: InputMaybe<OrderByDirection>;
  participant_id?: InputMaybe<OrderByDirection>;
};

export type Outing_ParticipantUpdateInput = {
  outing_id?: InputMaybe<Scalars['String']['input']>;
  participant_id?: InputMaybe<Scalars['String']['input']>;
};

export type Outing_ParticipantUpdateResponse = {
  __typename?: 'outing_participantUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing_Participant>;
};

export type Outing_Period = Node & {
  __typename?: 'outing_period';
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  outing: Outing;
  outing_id: Scalars['String']['output'];
  period: Period;
  period_id: Scalars['String']['output'];
};

export type Outing_PeriodConnection = {
  __typename?: 'outing_periodConnection';
  edges: Array<Outing_PeriodEdge>;
  pageInfo: PageInfo;
};

export type Outing_PeriodDeleteResponse = {
  __typename?: 'outing_periodDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing_Period>;
};

export type Outing_PeriodEdge = {
  __typename?: 'outing_periodEdge';
  cursor: Scalars['String']['output'];
  node: Outing_Period;
};

export type Outing_PeriodFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Outing_PeriodFilter>>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Outing_PeriodFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Outing_PeriodFilter>>;
  outing_id?: InputMaybe<StringFilter>;
  period_id?: InputMaybe<StringFilter>;
};

export type Outing_PeriodInsertInput = {
  outing_id?: InputMaybe<Scalars['String']['input']>;
  period_id?: InputMaybe<Scalars['String']['input']>;
};

export type Outing_PeriodInsertResponse = {
  __typename?: 'outing_periodInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing_Period>;
};

export type Outing_PeriodOrderBy = {
  outing_id?: InputMaybe<OrderByDirection>;
  period_id?: InputMaybe<OrderByDirection>;
};

export type Outing_PeriodUpdateInput = {
  outing_id?: InputMaybe<Scalars['String']['input']>;
  period_id?: InputMaybe<Scalars['String']['input']>;
};

export type Outing_PeriodUpdateResponse = {
  __typename?: 'outing_periodUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing_Period>;
};

export type Outing_Place = Node & {
  __typename?: 'outing_place';
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  outing: Outing;
  outing_id: Scalars['String']['output'];
  place: Place;
  place_id: Scalars['String']['output'];
};

export type Outing_PlaceConnection = {
  __typename?: 'outing_placeConnection';
  edges: Array<Outing_PlaceEdge>;
  pageInfo: PageInfo;
};

export type Outing_PlaceDeleteResponse = {
  __typename?: 'outing_placeDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing_Place>;
};

export type Outing_PlaceEdge = {
  __typename?: 'outing_placeEdge';
  cursor: Scalars['String']['output'];
  node: Outing_Place;
};

export type Outing_PlaceFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Outing_PlaceFilter>>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Outing_PlaceFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Outing_PlaceFilter>>;
  outing_id?: InputMaybe<StringFilter>;
  place_id?: InputMaybe<StringFilter>;
};

export type Outing_PlaceInsertInput = {
  outing_id?: InputMaybe<Scalars['String']['input']>;
  place_id?: InputMaybe<Scalars['String']['input']>;
};

export type Outing_PlaceInsertResponse = {
  __typename?: 'outing_placeInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing_Place>;
};

export type Outing_PlaceOrderBy = {
  outing_id?: InputMaybe<OrderByDirection>;
  place_id?: InputMaybe<OrderByDirection>;
};

export type Outing_PlaceUpdateInput = {
  outing_id?: InputMaybe<Scalars['String']['input']>;
  place_id?: InputMaybe<Scalars['String']['input']>;
};

export type Outing_PlaceUpdateResponse = {
  __typename?: 'outing_placeUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing_Place>;
};

export type Outing_Sport = Node & {
  __typename?: 'outing_sport';
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  outing: Outing;
  outing_id: Scalars['String']['output'];
  sport: Sport;
  sport_id: Scalars['String']['output'];
};

export type Outing_SportConnection = {
  __typename?: 'outing_sportConnection';
  edges: Array<Outing_SportEdge>;
  pageInfo: PageInfo;
};

export type Outing_SportDeleteResponse = {
  __typename?: 'outing_sportDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing_Sport>;
};

export type Outing_SportEdge = {
  __typename?: 'outing_sportEdge';
  cursor: Scalars['String']['output'];
  node: Outing_Sport;
};

export type Outing_SportFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<Outing_SportFilter>>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<Outing_SportFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<Outing_SportFilter>>;
  outing_id?: InputMaybe<StringFilter>;
  sport_id?: InputMaybe<StringFilter>;
};

export type Outing_SportInsertInput = {
  outing_id?: InputMaybe<Scalars['String']['input']>;
  sport_id?: InputMaybe<Scalars['String']['input']>;
};

export type Outing_SportInsertResponse = {
  __typename?: 'outing_sportInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing_Sport>;
};

export type Outing_SportOrderBy = {
  outing_id?: InputMaybe<OrderByDirection>;
  sport_id?: InputMaybe<OrderByDirection>;
};

export type Outing_SportUpdateInput = {
  outing_id?: InputMaybe<Scalars['String']['input']>;
  sport_id?: InputMaybe<Scalars['String']['input']>;
};

export type Outing_SportUpdateResponse = {
  __typename?: 'outing_sportUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Outing_Sport>;
};

export type Participant = Node & {
  __typename?: 'participant';
  firstname?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastname?: Maybe<Scalars['String']['output']>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  outing_participantCollection?: Maybe<Outing_ParticipantConnection>;
  surname?: Maybe<Scalars['String']['output']>;
};


export type ParticipantOuting_ParticipantCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Outing_ParticipantFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Outing_ParticipantOrderBy>>;
};

export type ParticipantConnection = {
  __typename?: 'participantConnection';
  edges: Array<ParticipantEdge>;
  pageInfo: PageInfo;
};

export type ParticipantDeleteResponse = {
  __typename?: 'participantDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Participant>;
};

export type ParticipantEdge = {
  __typename?: 'participantEdge';
  cursor: Scalars['String']['output'];
  node: Participant;
};

export type ParticipantFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<ParticipantFilter>>;
  firstname?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  lastname?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<ParticipantFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<ParticipantFilter>>;
  surname?: InputMaybe<StringFilter>;
};

export type ParticipantInsertInput = {
  firstname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  surname?: InputMaybe<Scalars['String']['input']>;
};

export type ParticipantInsertResponse = {
  __typename?: 'participantInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Participant>;
};

export type ParticipantOrderBy = {
  firstname?: InputMaybe<OrderByDirection>;
  id?: InputMaybe<OrderByDirection>;
  lastname?: InputMaybe<OrderByDirection>;
  surname?: InputMaybe<OrderByDirection>;
};

export type ParticipantUpdateInput = {
  firstname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  surname?: InputMaybe<Scalars['String']['input']>;
};

export type ParticipantUpdateResponse = {
  __typename?: 'participantUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Participant>;
};

export type Period = Node & {
  __typename?: 'period';
  id: Scalars['String']['output'];
  key: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  outing_periodCollection?: Maybe<Outing_PeriodConnection>;
};


export type PeriodOuting_PeriodCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Outing_PeriodFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Outing_PeriodOrderBy>>;
};

export type PeriodConnection = {
  __typename?: 'periodConnection';
  edges: Array<PeriodEdge>;
  pageInfo: PageInfo;
};

export type PeriodDeleteResponse = {
  __typename?: 'periodDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Period>;
};

export type PeriodEdge = {
  __typename?: 'periodEdge';
  cursor: Scalars['String']['output'];
  node: Period;
};

export type PeriodFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<PeriodFilter>>;
  id?: InputMaybe<StringFilter>;
  key?: InputMaybe<StringFilter>;
  label?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<PeriodFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<PeriodFilter>>;
};

export type PeriodInsertInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
};

export type PeriodInsertResponse = {
  __typename?: 'periodInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Period>;
};

export type PeriodOrderBy = {
  id?: InputMaybe<OrderByDirection>;
  key?: InputMaybe<OrderByDirection>;
  label?: InputMaybe<OrderByDirection>;
};

export type PeriodUpdateInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
};

export type PeriodUpdateResponse = {
  __typename?: 'periodUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Period>;
};

export type Place = Node & {
  __typename?: 'place';
  id: Scalars['String']['output'];
  key: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  outing_placeCollection?: Maybe<Outing_PlaceConnection>;
};


export type PlaceOuting_PlaceCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Outing_PlaceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Outing_PlaceOrderBy>>;
};

export type PlaceConnection = {
  __typename?: 'placeConnection';
  edges: Array<PlaceEdge>;
  pageInfo: PageInfo;
};

export type PlaceDeleteResponse = {
  __typename?: 'placeDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Place>;
};

export type PlaceEdge = {
  __typename?: 'placeEdge';
  cursor: Scalars['String']['output'];
  node: Place;
};

export type PlaceFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<PlaceFilter>>;
  id?: InputMaybe<StringFilter>;
  key?: InputMaybe<StringFilter>;
  label?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<PlaceFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<PlaceFilter>>;
};

export type PlaceInsertInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
};

export type PlaceInsertResponse = {
  __typename?: 'placeInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Place>;
};

export type PlaceOrderBy = {
  id?: InputMaybe<OrderByDirection>;
  key?: InputMaybe<OrderByDirection>;
  label?: InputMaybe<OrderByDirection>;
};

export type PlaceUpdateInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
};

export type PlaceUpdateResponse = {
  __typename?: 'placeUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Place>;
};

export type Sport = Node & {
  __typename?: 'sport';
  id: Scalars['String']['output'];
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
  /** Globally Unique Record Identifier */
  nodeId: Scalars['ID']['output'];
  outing_sportCollection?: Maybe<Outing_SportConnection>;
};


export type SportOuting_SportCollectionArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  filter?: InputMaybe<Outing_SportFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<Outing_SportOrderBy>>;
};

export type SportConnection = {
  __typename?: 'sportConnection';
  edges: Array<SportEdge>;
  pageInfo: PageInfo;
};

export type SportDeleteResponse = {
  __typename?: 'sportDeleteResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Sport>;
};

export type SportEdge = {
  __typename?: 'sportEdge';
  cursor: Scalars['String']['output'];
  node: Sport;
};

export type SportFilter = {
  /** Returns true only if all its inner filters are true, otherwise returns false */
  and?: InputMaybe<Array<SportFilter>>;
  id?: InputMaybe<StringFilter>;
  key?: InputMaybe<StringFilter>;
  label?: InputMaybe<StringFilter>;
  nodeId?: InputMaybe<IdFilter>;
  /** Negates a filter */
  not?: InputMaybe<SportFilter>;
  /** Returns true if at least one of its inner filters is true, otherwise returns false */
  or?: InputMaybe<Array<SportFilter>>;
};

export type SportInsertInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
};

export type SportInsertResponse = {
  __typename?: 'sportInsertResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Sport>;
};

export type SportOrderBy = {
  id?: InputMaybe<OrderByDirection>;
  key?: InputMaybe<OrderByDirection>;
  label?: InputMaybe<OrderByDirection>;
};

export type SportUpdateInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
};

export type SportUpdateResponse = {
  __typename?: 'sportUpdateResponse';
  /** Count of the records impacted by the mutation */
  affectedCount: Scalars['Int']['output'];
  /** Array of records impacted by the mutation */
  records: Array<Sport>;
};

export type ImageFragmentFragment = { __typename: 'image', id: string, url: string, height?: string | null, width?: string | null, image_formatCollection?: { __typename: 'image_formatConnection', edges: Array<{ __typename: 'image_formatEdge', node: { __typename: 'image_format', url: string, height?: string | null, width?: string | null, format: string } }> } | null };

export type OutingFragmentFragment = { __typename: 'outing', id: string, title?: string | null, cotation?: string | null, date?: string | null, elevation?: string | null, orientation?: string | null, content?: string | null, topos?: Array<string | null> | null, status?: string | null, cover?: { __typename: 'image', id: string, url: string, height?: string | null, width?: string | null, image_formatCollection?: { __typename: 'image_formatConnection', edges: Array<{ __typename: 'image_formatEdge', node: { __typename: 'image_format', url: string, height?: string | null, width?: string | null, format: string } }> } | null } | null, outing_imageCollection?: { __typename: 'outing_imageConnection', edges: Array<{ __typename: 'outing_imageEdge', node: { __typename: 'outing_image', image: { __typename: 'image', id: string, url: string, height?: string | null, width?: string | null, image_formatCollection?: { __typename: 'image_formatConnection', edges: Array<{ __typename: 'image_formatEdge', node: { __typename: 'image_format', url: string, height?: string | null, width?: string | null, format: string } }> } | null } } }> } | null, outing_sportCollection?: { __typename: 'outing_sportConnection', edges: Array<{ __typename: 'outing_sportEdge', node: { __typename: 'outing_sport', sport: { __typename: 'sport', key: string } } }> } | null, outing_participantCollection?: { __typename: 'outing_participantConnection', edges: Array<{ __typename: 'outing_participantEdge', node: { __typename: 'outing_participant', participant: { __typename: 'participant', surname?: string | null } } }> } | null, outing_placeCollection?: { __typename: 'outing_placeConnection', edges: Array<{ __typename: 'outing_placeEdge', node: { __typename: 'outing_place', place: { __typename: 'place', key: string } } }> } | null, outing_periodCollection?: { __typename: 'outing_periodConnection', edges: Array<{ __typename: 'outing_periodEdge', node: { __typename: 'outing_period', period: { __typename: 'period', key: string } } }> } | null };

export type GetAllOutingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllOutingsQuery = { __typename: 'Query', outingCollection?: { __typename: 'outingConnection', edges: Array<{ __typename: 'outingEdge', node: { __typename: 'outing', id: string, title?: string | null, cotation?: string | null, date?: string | null, elevation?: string | null, orientation?: string | null, content?: string | null, topos?: Array<string | null> | null, status?: string | null, cover?: { __typename: 'image', id: string, url: string, height?: string | null, width?: string | null, image_formatCollection?: { __typename: 'image_formatConnection', edges: Array<{ __typename: 'image_formatEdge', node: { __typename: 'image_format', url: string, height?: string | null, width?: string | null, format: string } }> } | null } | null, outing_imageCollection?: { __typename: 'outing_imageConnection', edges: Array<{ __typename: 'outing_imageEdge', node: { __typename: 'outing_image', image: { __typename: 'image', id: string, url: string, height?: string | null, width?: string | null, image_formatCollection?: { __typename: 'image_formatConnection', edges: Array<{ __typename: 'image_formatEdge', node: { __typename: 'image_format', url: string, height?: string | null, width?: string | null, format: string } }> } | null } } }> } | null, outing_sportCollection?: { __typename: 'outing_sportConnection', edges: Array<{ __typename: 'outing_sportEdge', node: { __typename: 'outing_sport', sport: { __typename: 'sport', key: string } } }> } | null, outing_participantCollection?: { __typename: 'outing_participantConnection', edges: Array<{ __typename: 'outing_participantEdge', node: { __typename: 'outing_participant', participant: { __typename: 'participant', surname?: string | null } } }> } | null, outing_placeCollection?: { __typename: 'outing_placeConnection', edges: Array<{ __typename: 'outing_placeEdge', node: { __typename: 'outing_place', place: { __typename: 'place', key: string } } }> } | null, outing_periodCollection?: { __typename: 'outing_periodConnection', edges: Array<{ __typename: 'outing_periodEdge', node: { __typename: 'outing_period', period: { __typename: 'period', key: string } } }> } | null } }> } | null };

export type GetLatestOutingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLatestOutingsQuery = { __typename: 'Query', outingCollection?: { __typename: 'outingConnection', edges: Array<{ __typename: 'outingEdge', node: { __typename: 'outing', id: string, title?: string | null, cotation?: string | null, date?: string | null, elevation?: string | null, orientation?: string | null, content?: string | null, topos?: Array<string | null> | null, status?: string | null, cover?: { __typename: 'image', id: string, url: string, height?: string | null, width?: string | null, image_formatCollection?: { __typename: 'image_formatConnection', edges: Array<{ __typename: 'image_formatEdge', node: { __typename: 'image_format', url: string, height?: string | null, width?: string | null, format: string } }> } | null } | null, outing_imageCollection?: { __typename: 'outing_imageConnection', edges: Array<{ __typename: 'outing_imageEdge', node: { __typename: 'outing_image', image: { __typename: 'image', id: string, url: string, height?: string | null, width?: string | null, image_formatCollection?: { __typename: 'image_formatConnection', edges: Array<{ __typename: 'image_formatEdge', node: { __typename: 'image_format', url: string, height?: string | null, width?: string | null, format: string } }> } | null } } }> } | null, outing_sportCollection?: { __typename: 'outing_sportConnection', edges: Array<{ __typename: 'outing_sportEdge', node: { __typename: 'outing_sport', sport: { __typename: 'sport', key: string } } }> } | null, outing_participantCollection?: { __typename: 'outing_participantConnection', edges: Array<{ __typename: 'outing_participantEdge', node: { __typename: 'outing_participant', participant: { __typename: 'participant', surname?: string | null } } }> } | null, outing_placeCollection?: { __typename: 'outing_placeConnection', edges: Array<{ __typename: 'outing_placeEdge', node: { __typename: 'outing_place', place: { __typename: 'place', key: string } } }> } | null, outing_periodCollection?: { __typename: 'outing_periodConnection', edges: Array<{ __typename: 'outing_periodEdge', node: { __typename: 'outing_period', period: { __typename: 'period', key: string } } }> } | null } }> } | null };

export type GetOutingByIdQueryVariables = Exact<{
  outingId?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetOutingByIdQuery = { __typename: 'Query', outingCollection?: { __typename: 'outingConnection', edges: Array<{ __typename: 'outingEdge', node: { __typename: 'outing', id: string, title?: string | null, cotation?: string | null, date?: string | null, elevation?: string | null, orientation?: string | null, content?: string | null, topos?: Array<string | null> | null, status?: string | null, cover?: { __typename: 'image', id: string, url: string, height?: string | null, width?: string | null, image_formatCollection?: { __typename: 'image_formatConnection', edges: Array<{ __typename: 'image_formatEdge', node: { __typename: 'image_format', url: string, height?: string | null, width?: string | null, format: string } }> } | null } | null, outing_imageCollection?: { __typename: 'outing_imageConnection', edges: Array<{ __typename: 'outing_imageEdge', node: { __typename: 'outing_image', image: { __typename: 'image', id: string, url: string, height?: string | null, width?: string | null, image_formatCollection?: { __typename: 'image_formatConnection', edges: Array<{ __typename: 'image_formatEdge', node: { __typename: 'image_format', url: string, height?: string | null, width?: string | null, format: string } }> } | null } } }> } | null, outing_sportCollection?: { __typename: 'outing_sportConnection', edges: Array<{ __typename: 'outing_sportEdge', node: { __typename: 'outing_sport', sport: { __typename: 'sport', key: string } } }> } | null, outing_participantCollection?: { __typename: 'outing_participantConnection', edges: Array<{ __typename: 'outing_participantEdge', node: { __typename: 'outing_participant', participant: { __typename: 'participant', surname?: string | null } } }> } | null, outing_placeCollection?: { __typename: 'outing_placeConnection', edges: Array<{ __typename: 'outing_placeEdge', node: { __typename: 'outing_place', place: { __typename: 'place', key: string } } }> } | null, outing_periodCollection?: { __typename: 'outing_periodConnection', edges: Array<{ __typename: 'outing_periodEdge', node: { __typename: 'outing_period', period: { __typename: 'period', key: string } } }> } | null } }> } | null };

export type GetSportOutingsQueryVariables = Exact<{
  sportSlug?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSportOutingsQuery = { __typename: 'Query', sportCollection?: { __typename: 'sportConnection', edges: Array<{ __typename: 'sportEdge', node: { __typename: 'sport', outing_sportCollection?: { __typename: 'outing_sportConnection', edges: Array<{ __typename: 'outing_sportEdge', node: { __typename: 'outing_sport', outing: { __typename: 'outing', id: string, title?: string | null, cotation?: string | null, date?: string | null, elevation?: string | null, orientation?: string | null, content?: string | null, topos?: Array<string | null> | null, status?: string | null, cover?: { __typename: 'image', id: string, url: string, height?: string | null, width?: string | null, image_formatCollection?: { __typename: 'image_formatConnection', edges: Array<{ __typename: 'image_formatEdge', node: { __typename: 'image_format', url: string, height?: string | null, width?: string | null, format: string } }> } | null } | null, outing_imageCollection?: { __typename: 'outing_imageConnection', edges: Array<{ __typename: 'outing_imageEdge', node: { __typename: 'outing_image', image: { __typename: 'image', id: string, url: string, height?: string | null, width?: string | null, image_formatCollection?: { __typename: 'image_formatConnection', edges: Array<{ __typename: 'image_formatEdge', node: { __typename: 'image_format', url: string, height?: string | null, width?: string | null, format: string } }> } | null } } }> } | null, outing_sportCollection?: { __typename: 'outing_sportConnection', edges: Array<{ __typename: 'outing_sportEdge', node: { __typename: 'outing_sport', sport: { __typename: 'sport', key: string } } }> } | null, outing_participantCollection?: { __typename: 'outing_participantConnection', edges: Array<{ __typename: 'outing_participantEdge', node: { __typename: 'outing_participant', participant: { __typename: 'participant', surname?: string | null } } }> } | null, outing_placeCollection?: { __typename: 'outing_placeConnection', edges: Array<{ __typename: 'outing_placeEdge', node: { __typename: 'outing_place', place: { __typename: 'place', key: string } } }> } | null, outing_periodCollection?: { __typename: 'outing_periodConnection', edges: Array<{ __typename: 'outing_periodEdge', node: { __typename: 'outing_period', period: { __typename: 'period', key: string } } }> } | null } } }> } | null } }> } | null };

export const ImageFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"imageFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"image_formatCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"format"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ImageFragmentFragment, unknown>;
export const OutingFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"outingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"outing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"cotation"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"elevation"}},{"kind":"Field","name":{"kind":"Name","value":"orientation"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"topos"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","alias":{"kind":"Name","value":"cover"},"name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"imageFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_imageCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"imageFragment"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_sportCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"sport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_participantCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"participant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_placeCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"place"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_periodCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"period"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"imageFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"image_formatCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"format"}}]}}]}}]}}]}}]} as unknown as DocumentNode<OutingFragmentFragment, unknown>;
export const GetAllOutingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllOutings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"outingCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"date"},"value":{"kind":"EnumValue","value":"DescNullsLast"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"outingFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"imageFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"image_formatCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"format"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"outingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"outing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"cotation"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"elevation"}},{"kind":"Field","name":{"kind":"Name","value":"orientation"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"topos"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","alias":{"kind":"Name","value":"cover"},"name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"imageFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_imageCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"imageFragment"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_sportCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"sport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_participantCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"participant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_placeCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"place"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_periodCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"period"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllOutingsQuery, GetAllOutingsQueryVariables>;
export const GetLatestOutingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLatestOutings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"outingCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"3"}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"date"},"value":{"kind":"EnumValue","value":"DescNullsLast"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"outingFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"imageFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"image_formatCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"format"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"outingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"outing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"cotation"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"elevation"}},{"kind":"Field","name":{"kind":"Name","value":"orientation"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"topos"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","alias":{"kind":"Name","value":"cover"},"name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"imageFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_imageCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"imageFragment"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_sportCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"sport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_participantCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"participant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_placeCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"place"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_periodCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"period"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetLatestOutingsQuery, GetLatestOutingsQueryVariables>;
export const GetOutingByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOutingById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"outingId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"outingCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"outingId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"outingFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"imageFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"image_formatCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"format"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"outingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"outing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"cotation"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"elevation"}},{"kind":"Field","name":{"kind":"Name","value":"orientation"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"topos"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","alias":{"kind":"Name","value":"cover"},"name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"imageFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_imageCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"imageFragment"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_sportCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"sport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_participantCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"participant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_placeCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"place"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_periodCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"period"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOutingByIdQuery, GetOutingByIdQueryVariables>;
export const GetSportOutingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSportOutings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sportSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"sportCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"key"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sportSlug"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"outing_sportCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"outing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"outingFragment"}}]}}]}}]}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"imageFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"image_formatCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"format"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"outingFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"outing"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"cotation"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"elevation"}},{"kind":"Field","name":{"kind":"Name","value":"orientation"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"topos"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","alias":{"kind":"Name","value":"cover"},"name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"imageFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_imageCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"imageFragment"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_sportCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"sport"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_participantCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"participant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"surname"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_placeCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"place"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"outing_periodCollection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"period"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetSportOutingsQuery, GetSportOutingsQueryVariables>;