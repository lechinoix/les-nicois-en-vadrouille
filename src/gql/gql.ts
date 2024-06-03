/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n\tfragment imageFragment on image {\n\t\tid\n\t\turl\n\t\theight\n\t\twidth\n\t\timage_formatCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\turl\n\t\t\t\t\theight\n\t\t\t\t\twidth\n\t\t\t\t\tformat\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.ImageFragmentFragmentDoc,
    "\n\t\n\tfragment outingFragment on outing {\n\t\tid\n\t\ttitle\n\t\tcotation\n\t\tdate\n\t\televation\n\t\torientation\n\t\tcontent\n\t\ttopos\n\t\tstatus\n\t\tcover: image {\n\t\t\t...imageFragment\n\t\t}\n\t\touting_imageCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\timage {\n\t\t\t\t\t\t...imageFragment\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\touting_sportCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tsport {\n\t\t\t\t\t\tkey\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\touting_participantCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tparticipant {\n\t\t\t\t\t\tsurname\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\touting_placeCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tplace {\n\t\t\t\t\t\tkey\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\touting_periodCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tperiod {\n\t\t\t\t\t\tkey\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.OutingFragmentFragmentDoc,
    "\n\t\n\n\tquery getAllOutings {\n\t\toutingCollection(orderBy: { date: DescNullsLast }) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\t...outingFragment\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.GetAllOutingsDocument,
    "\n\t\n\n\tquery getLatestOutings {\n\t\toutingCollection(first: 3, orderBy: { date: DescNullsLast }) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\t...outingFragment\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.GetLatestOutingsDocument,
    "\n\t\n\n\tquery getOutingById($outingId: String) {\n\t\toutingCollection(filter: { id: { eq: $outingId } }) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\t...outingFragment\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.GetOutingByIdDocument,
    "\n\n\nquery getSportOutings($sportSlug: String) {\n  sportCollection(filter: {key: {eq: $sportSlug}}) {\n    edges {\n      node {\n        outing_sportCollection {\n          edges {\n            node {\n              outing {\n                ...outingFragment\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n": types.GetSportOutingsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment imageFragment on image {\n\t\tid\n\t\turl\n\t\theight\n\t\twidth\n\t\timage_formatCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\turl\n\t\t\t\t\theight\n\t\t\t\t\twidth\n\t\t\t\t\tformat\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tfragment imageFragment on image {\n\t\tid\n\t\turl\n\t\theight\n\t\twidth\n\t\timage_formatCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\turl\n\t\t\t\t\theight\n\t\t\t\t\twidth\n\t\t\t\t\tformat\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\n\tfragment outingFragment on outing {\n\t\tid\n\t\ttitle\n\t\tcotation\n\t\tdate\n\t\televation\n\t\torientation\n\t\tcontent\n\t\ttopos\n\t\tstatus\n\t\tcover: image {\n\t\t\t...imageFragment\n\t\t}\n\t\touting_imageCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\timage {\n\t\t\t\t\t\t...imageFragment\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\touting_sportCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tsport {\n\t\t\t\t\t\tkey\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\touting_participantCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tparticipant {\n\t\t\t\t\t\tsurname\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\touting_placeCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tplace {\n\t\t\t\t\t\tkey\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\touting_periodCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tperiod {\n\t\t\t\t\t\tkey\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\t\n\tfragment outingFragment on outing {\n\t\tid\n\t\ttitle\n\t\tcotation\n\t\tdate\n\t\televation\n\t\torientation\n\t\tcontent\n\t\ttopos\n\t\tstatus\n\t\tcover: image {\n\t\t\t...imageFragment\n\t\t}\n\t\touting_imageCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\timage {\n\t\t\t\t\t\t...imageFragment\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\touting_sportCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tsport {\n\t\t\t\t\t\tkey\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\touting_participantCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tparticipant {\n\t\t\t\t\t\tsurname\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\touting_placeCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tplace {\n\t\t\t\t\t\tkey\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\touting_periodCollection {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tperiod {\n\t\t\t\t\t\tkey\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\n\n\tquery getAllOutings {\n\t\toutingCollection(orderBy: { date: DescNullsLast }) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\t...outingFragment\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\t\n\n\tquery getAllOutings {\n\t\toutingCollection(orderBy: { date: DescNullsLast }) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\t...outingFragment\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\n\n\tquery getLatestOutings {\n\t\toutingCollection(first: 3, orderBy: { date: DescNullsLast }) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\t...outingFragment\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\t\n\n\tquery getLatestOutings {\n\t\toutingCollection(first: 3, orderBy: { date: DescNullsLast }) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\t...outingFragment\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\n\n\tquery getOutingById($outingId: String) {\n\t\toutingCollection(filter: { id: { eq: $outingId } }) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\t...outingFragment\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\t\n\n\tquery getOutingById($outingId: String) {\n\t\toutingCollection(filter: { id: { eq: $outingId } }) {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\t...outingFragment\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\n\nquery getSportOutings($sportSlug: String) {\n  sportCollection(filter: {key: {eq: $sportSlug}}) {\n    edges {\n      node {\n        outing_sportCollection {\n          edges {\n            node {\n              outing {\n                ...outingFragment\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"): (typeof documents)["\n\n\nquery getSportOutings($sportSlug: String) {\n  sportCollection(filter: {key: {eq: $sportSlug}}) {\n    edges {\n      node {\n        outing_sportCollection {\n          edges {\n            node {\n              outing {\n                ...outingFragment\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;