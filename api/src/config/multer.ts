import multer from "multer";

export default {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 4 * 1024 * 1024
    },
    fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
        const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG, JPG, and PNG formats are allowed!"));
        }
    }
}