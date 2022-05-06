const ProducerService = require('../../services/rabbitmq/ProducerService');
const ExportsValidator = require('../../validator/exports');
const errorResponse = require('../../payload/response/errorResponse');

class ExportsHandler {
  constructor() {
    this._service = ProducerService;
    this._validator = ExportsValidator;

    this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
  }

  async postExportNotesHandler(request, h) {
    try {
      this._validator.validateExportNotesPayload(request.payload);

      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
      };

      await this._service.sendMessage('export:notes', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      });
      response.code(201);
      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = ExportsHandler;
