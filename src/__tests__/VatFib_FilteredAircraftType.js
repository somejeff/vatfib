const { VatFib } = require("../VatFib");

describe("Filtered Gates by Defined Aircraft Type", () => {
  const fib = new VatFib({
    terminals: [
      {
        name: "T1",
        gates: [
          {
            name: "B1",
            // airbus
            aircraft_short: /A3\d+/,
          },
          {
            name: "B2",
            // boeing
            aircraft_short: /B7\d+/,
          },
          {
            name: "B3",
          },
        ],
      },
    ],
  });
  it("should return Gate B1 for airbus", () => {
    const flights = [];
    for (let i = 0; i < 100; i++) {
      flights.push({
        aircraft_short: `A320`,
      });
    }
    fib.setFlights({ flights, flights });

    flights.forEach((flight) => {
      expect(flight.gate).toBe("B1");
    });
  });
});
