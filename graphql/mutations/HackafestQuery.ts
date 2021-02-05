/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BoundsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: HackafestsQuery
// ====================================================

export interface HackafestsQuery_hackafests {
  __typename: "Hackafest";
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  publicId: string;
  title: string;
  time: string;
  date: string;
}

export interface HackafestsQuery {
  hackafests: HackafestsQuery_hackafests[];
}

export interface HackafestsQueryVariables {
  bounds: BoundsInput;
}