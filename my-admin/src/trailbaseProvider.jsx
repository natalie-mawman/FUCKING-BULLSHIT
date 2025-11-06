export const createTrailbaseProvider = (apiUrl) => {
  const httpClient = async (url, options = {}) => {
    if (!options.headers) {
      options.headers = new Headers({ Accept: 'application/json' });
    }
    
    // Add authentication token to requests
    const token = localStorage.getItem('token');
    if (token) {
      options.headers.set('Authorization', `Bearer ${token}`);
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    
    const json = await response.json();
    return { json };
  };

  return {
    getList: async (resource, params) => {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      
      const query = {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        filter: JSON.stringify(params.filter),
      };
      
      const url = `${apiUrl}api/records/v1/${resource}?${new URLSearchParams(query)}`;
      const { json } = await httpClient(url);
      
      return {
        data: json.data || json,
        total: json.total || json.length,
      };
    },

    getOne: async (resource, params) => {
      const url = `${apiUrl}api/records/v1/${resource}/${params.id}`;
      const { json } = await httpClient(url);
      return { data: json };
    },

    getMany: async (resource, params) => {
      const query = {
        filter: JSON.stringify({ id: params.ids }),
      };
      const url = `${apiUrl}api/records/v1/${resource}?${new URLSearchParams(query)}`;
      const { json } = await httpClient(url);
      return { data: json.data || json };
    },

    getManyReference: async (resource, params) => {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      
      const query = {
        sort: JSON.stringify([field, order]),
        range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
        filter: JSON.stringify({
          ...params.filter,
          [params.target]: params.id,
        }),
      };
      
      const url = `${apiUrl}api/records/v1/${resource}?${new URLSearchParams(query)}`;
      const { json } = await httpClient(url);
      
      return {
        data: json.data || json,
        total: json.total || json.length,
      };
    },

    create: async (resource, params) => {
      const url = `${apiUrl}api/records/v1/${resource}`;
      const { json } = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      });
      return { data: { ...params.data, id: json.id } };
    },

    update: async (resource, params) => {
      const url = `${apiUrl}api/records/v1/${resource}/${params.id}`;
      const { json } = await httpClient(url, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      });
      return { data: json };
    },

    updateMany: async (resource, params) => {
      const responses = await Promise.all(
        params.ids.map(id =>
          httpClient(`${apiUrl}api/records/v1/${resource}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
          })
        )
      );
      return { data: params.ids };
    },

    delete: async (resource, params) => {
      const url = `${apiUrl}api/records/v1/${resource}/${params.id}`;
      const { json } = await httpClient(url, {
        method: 'DELETE',
      });
      return { data: json };
    },

    deleteMany: async (resource, params) => {
      await Promise.all(
        params.ids.map(id =>
          httpClient(`${apiUrl}api/records/v1/${resource}/${id}`, {
            method: 'DELETE',
          })
        )
      );
      return { data: params.ids };
    },
  };
};