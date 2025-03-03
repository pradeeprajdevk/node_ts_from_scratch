import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middlewares/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import authenticated from '@/middlewares/authenticated.middleware';

class UserController implements Controller {
    public path = "/users";
    public router = Router();
    private readonly userService = new UserService();

    constructor() {
        this.intialiseRoutes();
    }

    private intialiseRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );
        this.router.get(`${this.path}`, authenticated, this.getUser);
    }

    private readonly register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { name, email, password } = req.body;

            const token = await this.userService.register(
                name,
                email,
                password,
                'user'
            );

            res.status(201).json({ token });
        } catch(e: any) {
            next(new HttpException(400, e.message));
        }
    }

    private readonly login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { email, password } = req.body;

            const token = await this.userService.login(email, password);

            res.status(200).json(token);
        } catch(e: any) {
            next(new HttpException(400, e.message));
        }
    }

    private readonly getUser = (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        if(!req.user) {
            return next(new HttpException(404, 'No logged in user'));
        }

        res.status(200).send({ data: req.user });
    }
}

export default UserController;