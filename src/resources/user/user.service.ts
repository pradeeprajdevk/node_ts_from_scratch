import UserModel from '@/resources/user/user.model';
import token from '@/utils/token';


class UserService {
    private user = UserModel;

    /**
     * Register a new user
     */
    public async register(
        name: string,
        email: string,
        password: string,
        role: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.create({ name, email, password, role });

            const accessToken = token.createToken(user);

            return accessToken;
        } catch(e: any) {
            throw new Error('Unable to create User');
        }
    }

    /**
     * Attemp to login a user
     */
    public async login(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.findOne({email});

            if (!user) {
                throw new Error('Unable to find user with that email address');
            }

            if (await user.isValidPassword(password)) {
                return token.createToken(user);
            } else {
                throw new Error('Wrong credentials given');
            }
        } catch(e: any) {
            throw new Error('Unable to login user');
        }
    }
}

export default UserService;