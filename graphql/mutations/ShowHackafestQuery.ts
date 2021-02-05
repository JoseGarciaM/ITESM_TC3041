/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShowHackafestQuery
// ====================================================

export interface ShowHackafestQuery_hackafest_nearby {
  __typename: "Hackafest";
  id: string;
  latitude: number;
  longitude: number;
}

export interface ShowHackafestQuery_hackafest {
  __typename: "Hackafest";
  id: string;
  userId: string;
  address: string;
  publicId: string;
  title: string;
  time: string;
  date: string;
  latitude: number;
  longitude: number;
  nearby: ShowHackafestQuery_hackafest_nearby[];
}

export interface ShowHackafestQuery {
  hackafest: ShowHackafestQuery_hackafest | null;
}

export interface ShowHackafestQueryVariables {
  id: string;
}