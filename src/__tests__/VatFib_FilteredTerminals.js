const VatFib = require("../VatFib");

describe("Filtered Terminals by Callsign", () => {
  it("should remove terminals that don't match a callsign filter", () => {
    const fib = new VatFib({
      terminals: [
        {
          callsign: /^ACA/,
          name: "T1",
        },
        {
          name: "T2",
        },
        {
          name: "T3",
        },
      ],
    });

    // several flights
    const departures = [];
    for (let i = 0; i < 1000; i++) {
      departures.push({
        callsign: `ACA${i}`,
      });
    }
    fib.setFlights({ departures });

    // All flights T1 or T3
    fib.flights.departures.forEach((flight) => {
      expect(flight.terminal).toMatch(/T1|T3/);
    });
  });
});
