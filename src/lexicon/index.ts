/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  XrpcClient,
  type FetchHandler,
  type FetchHandlerOptions,
} from '@atproto/xrpc'
import { schemas } from './lexicons.js'
// import { CID } from 'multiformats/cid' // Temporarily disabled - unused
import { type OmitKey, type Un$Typed } from './util.js'
import * as IncTorontoDiscoverBetaProfile from './types/inc/toronto/discover/beta/profile.js'

export * as IncTorontoDiscoverBetaProfile from './types/inc/toronto/discover/beta/profile.js'

export class AtpBaseClient extends XrpcClient {
  inc: IncNS

  constructor(options: FetchHandler | FetchHandlerOptions) {
    super(options, schemas)
    this.inc = new IncNS(this)
  }

  /** @deprecated use `this` instead */
  get xrpc(): XrpcClient {
    return this
  }
}

export class IncNS {
  _client: XrpcClient
  toronto: IncTorontoNS

  constructor(client: XrpcClient) {
    this._client = client
    this.toronto = new IncTorontoNS(client)
  }
}

export class IncTorontoNS {
  _client: XrpcClient
  discover: IncTorontoDiscoverNS

  constructor(client: XrpcClient) {
    this._client = client
    this.discover = new IncTorontoDiscoverNS(client)
  }
}

export class IncTorontoDiscoverNS {
  _client: XrpcClient
  beta: IncTorontoDiscoverBetaNS

  constructor(client: XrpcClient) {
    this._client = client
    this.beta = new IncTorontoDiscoverBetaNS(client)
  }
}

export class IncTorontoDiscoverBetaNS {
  _client: XrpcClient
  profile: IncTorontoDiscoverBetaProfileRecord

  constructor(client: XrpcClient) {
    this._client = client
    this.profile = new IncTorontoDiscoverBetaProfileRecord(client)
  }
}

export class IncTorontoDiscoverBetaProfileRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- AT Protocol generated types
    params: OmitKey<any, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: IncTorontoDiscoverBetaProfile.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'inc.toronto.discover.beta.profile',
      ...params,
    })
    return res.data
  }

  async get(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- AT Protocol generated types
    params: OmitKey<any, 'collection'>,
  ): Promise<{
    uri: string
    cid: string
    value: IncTorontoDiscoverBetaProfile.Record
  }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'inc.toronto.discover.beta.profile',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- AT Protocol generated types
      any,
      'collection' | 'record'
    >,
    record: Un$Typed<IncTorontoDiscoverBetaProfile.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'inc.toronto.discover.beta.profile'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- AT Protocol generated types
    params: OmitKey<any, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'inc.toronto.discover.beta.profile', ...params },
      { headers },
    )
  }
}
