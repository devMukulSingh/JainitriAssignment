This project built using honojs as framework and nodejs as runtime.

# STEPS to run the project locally-

    STEP1 -> Rename .env.example to .env and enter the `DATABASE_URL` and `JWT_SECRET`

    STEP2 -> Install dependencies using `bun install` or `npm install`

    STEP3 -> Generate prisma client using `bun run generate` or `npx prisma generate`

    STEP4 -> Migrate database schema using `bun run migrate` or `npx prisma migrate`

    STEP5 -> Run `bun run dev` or `npm run dev` to start the server

# API DOCUMENTATION -

    Base path - "/api/v1"

    1. Register a New User (Hospital)
        Endpoint: /auth/register
        Method: POST

        Description:
        Creates a new user (hospital) account.

        Request Body Example : {
            "email": "hospital@example.com",
            "name": "City Hospital",
            "password": "strongPassword123"
        }
        Response -> status:201, {
               msg: "User created successfully",
                data: {
                id: "1",
                name: "name",
                email: "email",
                token
            }
        }

        Error Responses:

        1. Status: 400 Bad Request
            error: [`field` is required]
        2. Status: 409 Conflict
            error: "user already exists"
        3. Status: 500
            error: Internal server error `error messsage`     

    2. User Login
        Endpoint: /auth/login
        Method: POST

        Description:
        Authenticates a user (hospital).

        Request Body Example:
            {
            "email": "hospital@example.com",
            "password": "strongPassword123"
            }
        Success Response:

        Status: 200 OK
        {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": 1,
            "email": "hospital@example.com",
            "name": "City Hospital"
            }
        }
        Error Responses:

        1. Status:400
            error:['field' is required]
        2. Status: 401 Unauthorized
            error: Invalid credentials.
        3. Status: 500
            error: Internal server error `error messsage`        

    3. Post a New Disease
        Endpoint: /disease/:userId/post-disease
        Method: POST

        Description:
            Creates a new disease record for the hospital (user). Optionally, the disease can be linked to a specific patient by providing patientId. (Note: In the current schema, each disease record is associated with one patient at most.)

        Path Parameters:
            userId (String) – The ID of the user (hospital).

        Request Body Example:
            {
                "name": "Influenza",
            }
        Success Response:
            Status: 201 Created
            {
            "id": 10,
            "name": "Influenza",
            "userId": 1,
            "patientId": 2
            }
            
        Error Responses:
            1. Status: 400 Bad Request
                error:[`field` is required]
            2. Status: 403 Unauthenticated
                error: Unauthenticated
            3. Status: 500
                error: Internal server error `error messsage`

    4. Post a New Patient
        Endpoint: /patient/:userId/post-patient
        Method: POST

        Description:
        Adds a new patient record for the specified user (hospital).

        Path Parameters:
        userId (String) – The ID of the user (hospital).

        Request Body Example:
            {
            "phone": "+1234567890",
            "name": "John Doe",
            "diseaseIds":[{id:"1",id:"2"}],
            "heartRate":"40"
            }

        Success Response:
        Status: 201 Created
            {
            "id": 2,
            "phone": "+1234567890",
            "name": "John Doe",
            "userId": 1,
            "createdAt": "2025-02-12T12:00:00.000Z",
            "updatedAt": "2025-02-12T12:00:00.000Z"
            }
        Error Responses:

            1. Status: 400 Bad Request
                error: [`field` is required]
            2. Status: 409 Conflict
                error: A patient with the given phone number already exists.
            3. Status: 500
                error: Internal server error `error messsage`

    5. Get All Patients for a User
        Endpoint: /patient/:userId/get-patients
        Method: GET

        Description:
        Retrieves a list of all patients associated with the given user (hospital).

        Path Parameters:

        userId (String) – The ID of the user (hospital).

        Success Response:
            Status: 200 OK
            [
            {
                "id": 2,
                "phone": "+1234567890",
                "name": "John Doe",
                "userId": 1,
                "createdAt": "2025-02-12T12:00:00.000Z",
                "updatedAt": "2025-02-12T12:00:00.000Z"
            },
            {
                "id": 3,
                "phone": "+1098765432",
                "name": "Jane Doe",
                "userId": 1,
                "createdAt": "2025-02-12T12:05:00.000Z",
                "updatedAt": "2025-02-12T12:05:00.000Z"
            }
            ]

        Error Responses:
            1. Status: 500
                error: Internal server error `error messsage`
    
    6. Get a Specific Patient by Phone

        Endpoint: /patient/:userId/get-patient/:phone
        Method: GET

        Description:
        Retrieves the details of a single patient, identified by their phone number, associated with the specified user (hospital).

        Path Parameters:
            userId (String) – The ID of the user (hospital).
            phone (String) – The patient's phone number.

        Success Response:
            Status: 200 OK
            {
            "id": 2,
            "phone": "+1234567890",
            "name": "John Doe",
            "userId": 1,
            "createdAt": "2025-02-12T12:00:00.000Z",
            "updatedAt": "2025-02-12T12:00:00.000Z"
            }

        Error Responses:
            1. Status: 500
                error: Internal server error `error messsage`