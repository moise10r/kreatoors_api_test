import User, { Device } from "../user/user.model";

export class DeviceService {
  public getDevices = async (userId: string): Promise<Device[]> => {
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");
    return user.devices || [];
  };

  public logoutDevice = async (
    userId: string,
    deviceId: string
  ): Promise<void> => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.devices = user.devices.filter(
      (device) => device.deviceId !== deviceId
    );
    await user.save();
  };
}
