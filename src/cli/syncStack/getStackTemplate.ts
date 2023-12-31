/* eslint-disable new-cap */
import cloudform, {DeletionPolicy, Fn, S3} from 'cloudform';
import Output from 'cloudform-types/types/output';

export type SyncStackOutput = {
  Bucket: string;
  URL: string;
};

export function getStackTemplate(stackName: string) {
  return JSON.parse(
    cloudform({
      // These values are made available to our program after the stack update is complete
      Outputs: {
        Bucket: {
          Value: Fn.Ref('Bucket'),
        },
        URL: {
          Value: Fn.Join('', [
            'http://',
            Fn.Ref('Bucket'),
            '.s3-',
            Fn.Ref('AWS::Region'),
            '.amazonaws.com',
          ]),
        },
      } as {[Key in keyof SyncStackOutput]: Output},

      Resources: {
        // This this is a file system to which we can upload files
        Bucket: new S3.Bucket({
          BucketName: stackName,
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: false,
            BlockPublicPolicy: false,
            IgnorePublicAcls: false,
            RestrictPublicBuckets: false,
          },
        }).deletionPolicy(DeletionPolicy.Delete),

        // This makes our files available publicly
        BucketPolicy: new S3.BucketPolicy({
          Bucket: Fn.Ref('Bucket'),
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: [Fn.Join('', [Fn.GetAtt('Bucket', 'Arn'), '/*'])],
              },
            ],
          },
        }).dependsOn(['Bucket']),
      },
    }),
  );
}
