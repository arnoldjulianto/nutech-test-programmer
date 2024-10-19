module.exports = (sequelize, DataTypes) => {
  const MembershipModel = sequelize.define(
    "MembershipModel",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      access_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      jwt_secret: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      last_login: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      profile_image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "membership",
      timestamps: true,
      createdAt: "created_on",
      updatedAt: "updated_on",
    }
  );

  return MembershipModel;
};
