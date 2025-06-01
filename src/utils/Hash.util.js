import bcrypt from "bcryptjs";

export const Hash = {

  hsh: async (model, field) => {
    const salt = await bcrypt.genSalt(10);
    model[field] = await bcrypt.hash(model[field], salt);
  },

  validate: (current, hashed) => {
    return bcrypt.compare(current, hashed);
  }
}