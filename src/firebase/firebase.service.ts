// import * as admin from 'firebase-admin';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class FirebaseService {
//   private firebaseApp;

//   constructor() {
//     const serviceAccount = {
//       type: 'service_account',
//       project_id: 'ideaspring-14',
//       private_key_id: '715b414f118b09bf8caf238aed3f0cecb9ddcb3e',
//       private_key:
//         '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC0a9pH0G3qhXli\n1ydZ0NjwCfGYXRtS8BbSgDUUc7mB7keDF1yXMGe9iIMvZ6HjXHmEy4yvnyoFVMDs\nBdSmaCokLr1bC9tOe292r2JbESdAe/G7aMWcUHHGL/YJxoeiv3FHWO5unyFNS4xf\nEbPEWwlvhnWZz+gbezhqk7UpthbjbcS6OxYTwSc9sb99QljABnnRqtQmAMqwC0Mm\n3D9wJU3gI702edPwRczPl35YxKS9bpTECNGpTUKMk+3JMibFqvzqf2kJmWTsW/Yy\nMJrlWrb3wpyKmqU3EoIHiI56WtVHwIkII2MERYdA5yejVKTn1our1Tp5YGCGvgAj\nmNQaUf7HAgMBAAECggEASrtp3Nk+ziefUgugpxlU4oib4+qdCMueCG9GjUQqEOGs\nCWbB2XYZYm6LODWK3uxNAW52xb/93dtvVdRMcukum3IoyO+uVWHXl6ep6+K9CX7N\ncD1DrS29EsSG+yGayRTXTSBPEs8jMisa574jYi/7RpDBYYa2s7tkcPDh13cvH+CD\nC2QntEHznbGtes3Ybg8Vv5ZX5XNkAspVki4KNF6Mo0wlTQnQ32dkWHQxZxYFU2Pj\n3A0DmiEaW7SonD4jJ0x22Tr4Uy660ZbUq6F0W0fR+Noe7R+D9bJrRgz02RBjPzem\nqYQyOp2HiXMOWlaTHytKcJGhrcWnlXop9XMzh8pHUQKBgQDsCQKAosqyNUkUjwuv\nJu4Q5Ra/6VW/V4qtxo0/dNnuM2jUHGNUMY1bcdI1Cko/Wtf+/bzCE/geWYJyjc0g\ne5b92+0CDOh9CVzq9DmLH5zyxcadKs+s2YcMftVBtv+RNiX5RGa3avXgHnK4n1pH\nn0aOYZYMO36oE/fUqoV8vy6ZywKBgQDDrpteAUVyt16yslrrpmpwJDx+WcvUa7y6\nTRfKTKdPvRgT/9xQUSeS9YoyPxL6OP0B2TmsuOD9rYEPVreVsdX/uE2yKlzEWYDJ\nPj8vo/p8pjRugpslu8VHGAXTtpNzJkRUkV6+vC/3Cg/eagal4bqBeBQLElaIV5kK\nc3aAw+5/dQKBgD1wXvFi7oYSrrImRfFSnddR+mj78LD8tYFkVHH3FZ8WTKwhs40/\n1L6/0uqxggAZwm2CWLbgAc7Ml9L/rCxPX083Butotr+NR111MuFO2kirSHaypRom\nCSwse5A+dSm0QZAvyNjng5bR9iSufg50nCYFqswGVIKlp/X4aQS+sv+fAoGAYWUH\nqYtCcK158cE55a4nrfcrMMwq2mhhP+zdGXB7mgGI+XNQyZ0K8GdLyGSCYo54xzHC\nNgiy2zA/W04TA+vGkoe+DB5vm77cjc1wj5qzMtVapWJWLDrAHvmC9PQbgaWbPug3\n2wE5cmDMsyvccTXfqU8F0tjmvueyoXQEmGRs0X0CgYBwLelmSUm2fYlY+Mq3qy1O\nSYfe8DS2La45si7qNFk4WDTcc46KyDGZeslkJglMiFiemGBHgDTj++s5A6tjCMs+\nbXu41M1TIoR4IJ2fKZ1C+ZdCLwOEwDF3eh2tlasuJvuRNcBEBGYpxygH+ZEnWjoq\nO+xvEuFJtJpvLFAYUuhoag==\n-----END PRIVATE KEY-----\n',
//       client_email:
//         'firebase-adminsdk-x4391@ideaspring-14.iam.gserviceaccount.com',
//       client_id: '109242798099332501026',
//       auth_uri: 'https://accounts.google.com/o/oauth2/auth',
//       token_uri: 'https://oauth2.googleapis.com/token',
//       auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
//       client_x509_cert_url:
//         'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-x4391%40ideaspring-14.iam.gserviceaccount.com',
//       universe_domain: 'googleapis.com',
//     };
//     this.firebaseApp = admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
//     });
//   }

//   get auth() {
//     return this.firebaseApp.auth();
//   }
// }
