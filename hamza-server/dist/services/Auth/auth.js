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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9BdXRoL2F1dGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsdUVBQXVFO0FBQ3ZFLDJDQUEyQztBQUMzQyxnREFBZ0Q7QUFDaEQsV0FBVztBQUNYLDRCQUE0QjtBQUM1QixxQkFBcUI7QUFDckIseUNBQXlDO0FBQ3pDLHVEQUF1RDtBQUN2RCxFQUFFO0FBQ0YsMkJBQTJCO0FBQzNCLDRCQUE0QjtBQUM1QixpRUFBaUU7QUFDakUsd0NBQXdDO0FBQ3hDLEtBQUs7QUFDTCxFQUFFO0FBQ0YsZ0RBQWdEO0FBQ2hELEVBQUU7QUFDRiw2QkFBNkI7QUFDN0IsdUJBQXVCO0FBQ3ZCLE1BQU07QUFDTixvQ0FBb0M7QUFDcEMsa0NBQWtDO0FBQ2xDLGdEQUFnRDtBQUNoRCxpQ0FBaUM7QUFDakMsbURBQW1EO0FBQ25ELHNCQUFzQjtBQUN0QixnRUFBZ0U7QUFDaEUsVUFBVTtBQUNWLEVBQUU7QUFDRiwrQ0FBK0M7QUFDL0MsRUFBRTtBQUNGLDZDQUE2QztBQUM3Qyw4QkFBOEI7QUFDOUIsdUVBQXVFO0FBQ3ZFLDhGQUE4RjtBQUM5RixzREFBc0Q7QUFDdEQsU0FBUztBQUNULEVBQUU7QUFDRix1REFBdUQ7QUFDdkQsdUNBQXVDO0FBQ3ZDLE1BQU07QUFDTixFQUFFO0FBQ0YsK0JBQStCO0FBQy9CLGdEQUFnRDtBQUNoRCxNQUFNO0FBQ04sRUFBRTtBQUNGLCtEQUErRDtBQUMvRCw2QkFBNkI7QUFDN0IsZ0RBQWdEO0FBQ2hELE1BQU07QUFDTixFQUFFO0FBQ0YsaUNBQWlDO0FBQ2pDLGdEQUFnRDtBQUNoRCxNQUFNO0FBQ04sRUFBRTtBQUNGLDJDQUEyQztBQUMzQyxnREFBZ0Q7QUFDaEQsTUFBTTtBQUNOLEVBQUU7QUFDRix3Q0FBd0M7QUFDeEMsZ0RBQWdEO0FBQ2hELE1BQU07QUFDTixFQUFFO0FBQ0Ysc0NBQXNDO0FBQ3RDLGdEQUFnRDtBQUNoRCxNQUFNO0FBQ04sRUFBRTtBQUNGLCtCQUErQjtBQUMvQixnREFBZ0Q7QUFDaEQsTUFBTTtBQUNOLEVBQUU7QUFDRiwrQkFBK0I7QUFDL0IsZ0RBQWdEO0FBQ2hELE1BQU07QUFDTixFQUFFO0FBQ0YscUNBQXFDO0FBQ3JDLGdEQUFnRDtBQUNoRCxNQUFNO0FBQ04sRUFBRTtBQUNGLG1EQUFtRDtBQUNuRCxnREFBZ0Q7QUFDaEQsTUFBTTtBQUNOLEVBQUU7QUFDRixrR0FBa0c7QUFDbEcsSUFBSTtBQUNKLEVBQUU7QUFDRiw4QkFBOEIifQ==