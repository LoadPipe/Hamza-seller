"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
exports.default = async (container) => {
    var _a;
    const secret_name = 'hamza-server-env-variables';
    const client = new client_secrets_manager_1.SecretsManagerClient({
        region: 'ap-southeast-2',
    });
    let response;
    try {
        if (process.env.USE_AWS_SECRETS) {
            response = await client.send(new client_secrets_manager_1.GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
            }));
            const secretData = JSON.parse(response.SecretString);
            for (let key of Object.keys(secretData)) {
                if (!((_a = process.env[key]) === null || _a === void 0 ? void 0 : _a.length))
                    process.env[key] = secretData[key];
            }
        }
    }
    catch (error) {
        // For a list of exceptions thrown, see
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        console.log(error);
        throw error;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcmV0cy1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xvYWRlcnMvc2VjcmV0cy1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEVBR3lDO0FBR3pDLGtCQUFlLEtBQUssRUFBRSxTQUEwQixFQUFpQixFQUFFOztJQUMvRCxNQUFNLFdBQVcsR0FBRyw0QkFBNEIsQ0FBQztJQUVqRCxNQUFNLE1BQU0sR0FBRyxJQUFJLDZDQUFvQixDQUFDO1FBQ3BDLE1BQU0sRUFBRSxnQkFBZ0I7S0FDM0IsQ0FBQyxDQUFDO0lBRUgsSUFBSSxRQUFRLENBQUM7SUFFYixJQUFJLENBQUM7UUFDRCxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDOUIsUUFBUSxHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FDeEIsSUFBSSw4Q0FBcUIsQ0FBQztnQkFDdEIsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLFlBQVksRUFBRSxZQUFZLEVBQUUscURBQXFEO2FBQ3BGLENBQUMsQ0FDTCxDQUFDO1lBRUYsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFckQsS0FBSyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxDQUFBLE1BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsMENBQUUsTUFBTSxDQUFBO29CQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQyxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsdUNBQXVDO1FBQ3ZDLHlGQUF5RjtRQUN6RixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25CLE1BQU0sS0FBSyxDQUFDO0lBQ2hCLENBQUM7QUFDTCxDQUFDLENBQUMifQ==