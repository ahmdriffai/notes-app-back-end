const UploadsValidator = require('../../validator/uploads');
const errorResponse = require('../../payload/response/errorResponse');

class UploadsHandler {
  constructor(service) {
    this._service = service;
    this._validator = UploadsValidator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { data } = request.payload;
      this._validator.validateImageHeaders(data.hapi.headers);

      const fileLocation = await this._service.writeFile(data, data.hapi);

      const response = h.response({
        status: 'success',
        data: {
          fileLocation,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = UploadsHandler;
