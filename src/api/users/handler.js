const errorResponse = require('../../payload/response/errorResponse');
const UsersService = require('../../services/postgres/UserService');
const UserValidator = require('../../validator/users/index');

class UsersHandler {
  constructor() {
    this._usersService = new UsersService();
    this._validator = UserValidator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);

      const { username, password, fullname } = request.payload;

      const userId = await this._usersService.addUser({ username, password, fullname });

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return errorResponse(h, error);
    }
  }

  async getUserByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const user = await this._usersService.getUserById(id);

      return {
        status: 'success',
        data: {
          user,
        },
      };
    } catch (error) {
      return errorResponse(h, error);
    }
  }
}

module.exports = UsersHandler;
