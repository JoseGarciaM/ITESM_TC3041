/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EditHackafestQuery
// ====================================================

export interface EditHackafestQuery_hackafest {
  __typename: "Hackafest";
  id: string;
  userId: string;
  address: string;
  image: string;
  publicId: string;
  title: string;
  time: string;
  date: string;
  latitude: number;
  longitude: number;
}

export interface EditHackafestQuery {
  hackafest: EditHackafestQuery_hackafest | null;
}

export interface EditHackafestQueryVariables {
  id: string;
}