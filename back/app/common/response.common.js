module.exports = {
  /**
   * @param res response object,
   * @param status status code,
   * @param message error message,
   * @param state error code,
   * @param extra any additional information
   */
  errorResponse: function (res, status, message, state, extra = null) {
    return res
      .status(status)
      .send({ error: true, msg: message, code: status, state, extra: extra });
  },

  /****
   * @param res response object,
   * @param status status code,
   * @param data information to send back,
   * @param extra any additional information
   */
  successResponse: function (res, status, data, extra = null) {
    return res.status(status).send({
      error: false,
      result: { value: data, status, extra: extra },
    });
  },
};
