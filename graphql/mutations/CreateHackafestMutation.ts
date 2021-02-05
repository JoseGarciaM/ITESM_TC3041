/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { HackafestInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateHackafestMutation
// ====================================================

export interface CreateHackafestMutation_createHackafest {
  __typename: "Hackafest";
  id: string;
}

export interface CreateHackafestMutation {
  createHackafest: CreateHackafestMutation_createHackafest | null;
}

export interface CreateHackafestMutationVariables {
  input: HackafestInput;
}