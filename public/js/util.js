const toQueryString = (obj) => {
  let result = '';
  for (const prop of obj) {
    if (obj.hasOwnProperty(prop)) {
      result += `${prop}=${obj[prop]}&`;
    }
  }
  return result.substring(0, result.length - 1);
};

export function AJAX(options) {
  const request = new XMLHttpRequest();

  let requestParams = {
    method: 'GET',
    url: window.location.href,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    success: () => {},
    error: () => {},
    data: {},
  };

  requestParams = Object.assign({}, requestParams, options);

  if (options.method.toUpperCase() === 'GET') {
    requestParams.url += `?${toQueryString(options.data)}`;
  }

  request.open(requestParams.method, requestParams.url, true);
  request.onload = () => {
    if (request.status === 200) {
      options.success(request.response);
    } else {
      options.error(request.response);
    }
  };

  request.send(JSON.stringify(options.data));
}
