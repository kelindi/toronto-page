/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  type LexiconDoc,
  Lexicons,
  ValidationError,
  type ValidationResult,
} from '@atproto/lexicon'
import { type $Typed, is$typed, maybe$typed } from './util'

export const schemaDict = {
  IncTorontoDiscoverBetaProfile: {
    lexicon: 1,
    id: 'inc.toronto.discover.beta.profile',
    defs: {
      main: {
        type: 'record',
        description: 'A Toronto profile entry',
        key: 'tid',
        record: {
          type: 'object',
          required: ['name', 'bio', 'interests', 'currentProject', 'createdAt'],
          properties: {
            name: {
              type: 'string',
              description:
                'Name or online alias - real name, artist name, or handle',
              minLength: 1,
              maxLength: 100,
              maxGraphemes: 100,
            },
            bio: {
              type: 'string',
              description:
                "Short bio - one-liner about who you are, what you make, or what you're about",
              maxLength: 300,
              maxGraphemes: 300,
            },
            interests: {
              type: 'array',
              description:
                'Keywords describing interests, focus areas, or creative mediums',
              items: {
                type: 'string',
                maxLength: 50,
                maxGraphemes: 50,
              },
              maxLength: 10,
            },
            neighbourhood: {
              type: 'string',
              description:
                "Toronto neighbourhood where you're based or do most of your work",
              maxLength: 100,
              maxGraphemes: 100,
            },
            currentProject: {
              type: 'string',
              description:
                "Short blurb about a project you're currently working on or exploring",
              maxLength: 500,
              maxGraphemes: 500,
            },
            twitterUrl: {
              type: 'string',
              format: 'uri',
              description: 'Twitter profile URL',
            },
            instagramUrl: {
              type: 'string',
              format: 'uri',
              description: 'Instagram profile URL',
            },
            githubUrl: {
              type: 'string',
              format: 'uri',
              description: 'GitHub profile URL',
            },
            linkedinUrl: {
              type: 'string',
              format: 'uri',
              description: 'LinkedIn profile URL',
            },
            websiteUrl: {
              type: 'string',
              format: 'uri',
              description: 'Personal website URL',
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
              description: 'When this profile was created',
            },
            updatedAt: {
              type: 'string',
              format: 'datetime',
              description: 'When this profile was last updated',
            },
          },
        },
      },
    },
  },
  XyzStatusphereStatus: {
    lexicon: 1,
    id: 'xyz.statusphere.status',
    defs: {
      main: {
        type: 'record',
        key: 'tid',
        record: {
          type: 'object',
          required: ['status', 'createdAt'],
          properties: {
            status: {
              type: 'string',
              minLength: 1,
              maxGraphemes: 1,
              maxLength: 32,
            },
            createdAt: {
              type: 'string',
              format: 'datetime',
            },
          },
        },
      },
    },
  },
} as const satisfies Record<string, LexiconDoc>
export const schemas = Object.values(schemaDict) satisfies LexiconDoc[]
export const lexicons: Lexicons = new Lexicons(schemas)

export function validate<T extends { $type: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType: true,
): ValidationResult<T>
export function validate<T extends { $type?: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: false,
): ValidationResult<T>
export function validate(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: boolean,
): ValidationResult {
  return (requiredType ? is$typed : maybe$typed)(v, id, hash)
    ? lexicons.validate(`${id}#${hash}`, v)
    : {
        success: false,
        error: new ValidationError(
          `Must be an object with "${hash === 'main' ? id : `${id}#${hash}`}" $type property`,
        ),
      }
}

export const ids = {
  IncTorontoDiscoverBetaProfile: 'inc.toronto.discover.beta.profile',
  XyzStatusphereStatus: 'xyz.statusphere.status',
} as const
