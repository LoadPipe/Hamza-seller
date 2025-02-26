import { Lifetime } from 'awilix';
import { User, UserService as MedusaUserService, UserRoles } from '@medusajs/medusa';
import {
    CreateUserInput,
    CreateUserInput as MedusaCreateUserInput,
    UpdateUserInput,
} from '@medusajs/medusa/dist/types/user';
import StoreRepository from '../repositories/store';

interface CustomUserInput extends MedusaCreateUserInput {
    store_id?: string;
}

interface CreateSellerUserInput extends Omit<CreateUserInput, 'password'> {
    wallet_address: string;
}

class UserService extends MedusaUserService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly loggedInUser_: User | null;
    protected readonly storeRepository_: typeof StoreRepository;

    constructor(container) {
        super(container);
        this.storeRepository_ = container.storeRepository;

        try {
            this.loggedInUser_ = container.loggedInUser;
        } catch (e) {
            // avoid errors when backend first runs
        }
    }

    async retrieveByWalletAddress(wallet_address: string): Promise<User> {
        const userRepo = this.manager_.withRepository(this.userRepository_);
        const user = await userRepo.findOne({
            where: { wallet_address: wallet_address.toLowerCase() },
        });
        if (!user) {
            throw new Error(
                'User not found with wallet address: ' + wallet_address
            );
        }
        return user;
    }

    async update(
        userId: string,
        update: UpdateUserInput & {
            role_id?: string;
        }
    ): Promise<User> {
        return super.update(userId, update);
    }

    async createSellerUserFromWallet(
        input: CreateSellerUserInput
    ): Promise<User> {
        const dummyPassword = 'wallet_default';
        const email =
            input.email || `${input.wallet_address}@wallet.example.com`;
        return await super.create(
            { ...input, email } as CreateUserInput,
            dummyPassword
        );
    }

    async createStoreMember(input: {
        firstName: string;
        lastName: string;
        email: string;
        store_id: string;
        currency?: string;
      }): Promise<User> {
        const dummyPassword = 'member_default';
        const memberData = {
          first_name: input.firstName,
          last_name: input.lastName,
          email: input.email,
          store_id: input.store_id,
          currency: input.currency,
          role: UserRoles.MEMBER,
        };
        return await super.create(memberData as CreateUserInput, dummyPassword);
      }
      


    //   async create(
    //     user: CreateUserInput,
    //     password: string
    //   ): Promise<User> {
    //     if (!user.store_id) {
    //       const storeRepo = this.manager_.withRepository(
    //         this.storeRepository_
    //       )
    //       let newStore = storeRepo.create()
    //       newStore = await storeRepo.save(newStore)
    //       user.store_id = newStore.id
    //     }

    //     return await super.create(user , password)
    //   }
}
export default UserService;
