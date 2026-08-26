import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    // ======================================================
    // NAME
    // ======================================================

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    // ======================================================
    // EMAIL
    // ======================================================

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,

      validate: {
        validator: (value: string) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),

        message:
          "Please enter a valid email address.",
      },
    },

    // ======================================================
    // PASSWORD
    // ======================================================

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    // ======================================================
    // ROLE
    // ======================================================

    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Invalid user role.",
      },
      default: "user",
      index: true,
    },
  },

  {
    timestamps: true,
  }
);

// ============================================================
// INDEX
// ============================================================

UserSchema.index({
  email: 1,
  role: 1,
});

// ============================================================
// MODEL
// ============================================================

const User =
  mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);

export default User;