export const initialSlots = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  occupied: false,
  user: "",
  endTime: "",
  reservation: ""
}));
