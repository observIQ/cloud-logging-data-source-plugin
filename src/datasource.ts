/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DataSourceInstanceSettings } from '@grafana/data';
import { BackendSrv, DataSourceWithBackend, getBackendSrv } from '@grafana/runtime';
import { CloudLoggingOptions, Query } from './types';

export class DataSource extends DataSourceWithBackend<Query, CloudLoggingOptions> {
  constructor(private instanceSettings: DataSourceInstanceSettings<CloudLoggingOptions>) {
    super(instanceSettings);
  }
  /**
   * Get the Project ID we parsed from the data source's JWT token
   *
   * @returns Project ID from the provided JWT token
   */
  getDefaultProject(): string {
    return this.instanceSettings.jsonData.defaultProject ?? '';
  }
  /**
   * Have the backend call `resourcemanager.projects.list` with our credentials,
   * and return the IDs of all projects found
   *
   * @param backendSrv  {@link BackendSrv} to make the request, only exposed for tests
   * @returns List of discovered project IDs
   */
  async getProjects(backendSrv: BackendSrv = getBackendSrv()): Promise<string[]> {
    try {
      const res = await backendSrv.get(`/api/datasources/${this.id}/resources/projects`);
      return res.projects;
    } catch (ex: unknown) {
      return [];
    }
  }
}
