/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { type ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../../../lexicons'
import {
  type $Typed,
  is$typed as _is$typed,
  type OmitKey,
} from '../../../../../util'

const is$typed = _is$typed,
  validate = _validate
const id = 'inc.toronto.discover.beta.profile'

export interface Record {
  $type: 'inc.toronto.discover.beta.profile'
  /** Name or online alias - real name, artist name, or handle */
  name: string
  /** Short bio - one-liner about who you are, what you make, or what you're about */
  bio: string
  /** Keywords describing interests, focus areas, or creative mediums */
  interests: string[]
  /** Toronto neighbourhood where you're based or do most of your work */
  neighbourhood?: string
  /** Short blurb about a project you're currently working on or exploring */
  currentProject: string
  /** Twitter profile URL */
  twitterUrl?: string
  /** Instagram profile URL */
  instagramUrl?: string
  /** GitHub profile URL */
  githubUrl?: string
  /** LinkedIn profile URL */
  linkedinUrl?: string
  /** Personal website URL */
  websiteUrl?: string
  /** When this profile was created */
  createdAt: string
  /** When this profile was last updated */
  updatedAt?: string
  [k: string]: unknown
}

const hashRecord = 'main'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true)
}
