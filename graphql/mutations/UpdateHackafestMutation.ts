/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { HackafestInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateHackafestMutation
// ====================================================

export interface UpdateHackafestMutation_updateHackafest {
  __typename: "Hackafest";
  id: string;
  image: string;
  publicId: string;
  latitude: number;
  longitude: number;
  title: string;
  time: string;
  date: string;
  address: string;
}

export interface UpdateHackafestMutation {
  updateHackafest: UpdateHackafestMutation_updateHackafest | null;
}

export interface UpdateHackafestMutationVariables {
  id: string;
  input: HackafestInput;
}