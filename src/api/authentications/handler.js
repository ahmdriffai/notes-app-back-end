const UsersService = require('../../services/postgres/UserService');
const AuthenticationsService = require('../../services/postgres/AuthenticationsService');
const TokenManager = require('../../tokenize/TokenManager');
const AuthenticationsValidator = require('../../validator/authenticatios');
const errorResponse = require('../../payload/response/errorResponse');

class AuthenticationsHandler {
  constructor() {
    this._authenticationsService = new AuthenticationsService();
    this._usersService = new UsersService();
    this._tokenManager = TokenManager;
    this._validator = AuthenticationsValidator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAutenticationPayload(request.payload);

      const { username, password } = request.payload;

      const id = await this._usersService.verifyUserCredential(username, password);

      const accessToken = this._tokenManager.genereteAccessToken({ id });
      const refreshToken = this._tokenManager.genereteRefreshToken({ id });

      await this._authenticationsService.addRefreshToken(refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }

  async putAuthenticationHandler(request, h) {
    try {
      this._validator.validatePutAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;

      await this._authenticationsService.verifyRefreshToken(refreshToken);

      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this._tokenManager.genereteAccessToken(id);

      return {
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
        },
      };
    } catch (error) {
      return errorResponse(h, error);
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;

      await this._authenticationsService.verifyRefreshToken(refreshToken);

      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      };
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = AuthenticationsHandler;
