function apiReq(method, url, data) {
  return new Promise((resolve, reject) => {
    if (method == "post") {
      fetch(url, {
        method: method,
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => resolve(res));
    } else {
      fetch(url, {
        method: method,
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => resolve(res));
    }
  });
}
