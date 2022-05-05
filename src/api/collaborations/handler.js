const errorResponse = require('../../payload/response/errorResponse');
const CollaborationsService = require('../../services/postgres/CollaborationsService');
const NotesService = require('../../services/postgres/NotesService');
const CollaborationsValidator = require('../../validator/collaborations');

class CollaborationsHandler {
  constructor() {
    this._collborationsService = new CollaborationsService();
    this._notesService = new NotesService();
    this._validator = CollaborationsValidator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { noteId, userId } = request.payload;

      await this._notesService.verifyNoteOwner(noteId, credentialId);

      const collaborationId = await this._collborationsService.addCollaboration(noteId, userId);

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { noteId, userId } = request.payload;

      await this._notesService.verifyNoteOwner(noteId, credentialId);

      await this._collborationsService.deleteCollaboration(noteId, userId);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = CollaborationsHandler;
