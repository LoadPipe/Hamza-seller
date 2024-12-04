// import { AuthService as MedusaAuthService } from "@medusajs/medusa";
// import { EntityManager } from "typeorm";
// import { UserRoles } from "@medusajs/medusa";
// import {
//   AnalyticsConfigService,
//   CreateUserInput,
// } from "../../utils/auth/auth-config";
// import { User } from "@medusajs/medusa/dist/models";
//
// type CreateAuthInput = {
//   wallet_address: string;
//   role?: UserRoles; // Assuming UserRoles is defined elsewhere
//   metadata?: Record<string, unknown>;
// };
//
// class AuthService extends MedusaAuthService {
//
//   constructor(container) {
//     super(container)
//   }
//   async createAuthenticatedUser_(
//     userInput: CreateUserInput,
//   ): Promise<{ user: User; token: string }> {
//     // Step 1: Create the user
//     const newUser = this.userRepository.create({
//       ...userInput,
//       // Set any default values or additional properties here
//     });
//
//     await this.userRepository.save(newUser);
//
//     // Step 2: Generate a JWT for the user
//     const token = jwt.sign(
//       { userId: newUser.id, walletAddress: newUser.wallet_address },
//       process.env.JWT_SECRET, // Ensure you have a JWT_SECRET in your environment variables
//       { expiresIn: "1h" }, // Token expiration time
//     );
//
//     // Step 3: Return the created user and their JWT
//     return { user: newUser, token };
//   }
//
//   create(): Promise<never> {
//     throw new Error("Method not supported.");
//   }
//
//   // Override and disable all other methods from UserService
//   list(): Promise<never> {
//     throw new Error("Method not supported.");
//   }
//
//   retrieve(): Promise<never> {
//     throw new Error("Method not supported.");
//   }
//
//   retrieveByApiToken(): Promise<never> {
//     throw new Error("Method not supported.");
//   }
//
//   retrieveByEmail(): Promise<never> {
//     throw new Error("Method not supported.");
//   }
//
//   hashPassword_(): Promise<never> {
//     throw new Error("Method not supported.");
//   }
//
//   update(): Promise<never> {
//     throw new Error("Method not supported.");
//   }
//
//   delete(): Promise<never> {
//     throw new Error("Method not supported.");
//   }
//
//   setPassword_(): Promise<never> {
//     throw new Error("Method not supported.");
//   }
//
//   generateResetPasswordToken(): Promise<never> {
//     throw new Error("Method not supported.");
//   }
//
//   // Any other methods inherited from UserService should also be overridden in a similar manner
// }
//
// export default AuthService;
