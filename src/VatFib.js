/**
 * Flight information board: Displays inbound and outbound flights with gate assignments and status
 *
 */
class VatFib {
  constructor(config) {
    // Default configuration
    this.config = {
      // Defaults to a main terminal
      terminals: [
        {
          // callsign: any
          // aircraft: any
          name: "Main",
          gates: [
            {
              // callsign: any
              // aircraft: any
              name: "A",
            },
          ],
        },
      ],
    };
    // Merge user-provided configurations with default configurations
    if (config && typeof config === "object") {
      this.config = { ...this.config, ...config };
    }

    //
    this.flights = {
      arrivals: [],
      departures: [],
    };
  }

  setFlights(flights) {
    this.flights = flights;
    this.assignTerminalAndGates();
  }

  assignTerminalAndGates() {
    this.flights.departures?.forEach((flight) => {
      const selectedTerminal = this.selectTerminal(flight);
      const selectedGate = selectedTerminal.gates[0];
      flight.terminal = selectedTerminal.name;
      flight.gate = selectedGate.name;
    });

    this.flights.arrivals?.forEach((flight) => {
      const selectedTerminal = this.selectTerminal(flight);
      const selectedGate = this.selectGate(flight,selectedTerminal);
      flight.terminal = selectedTerminal.name;
      flight.gate = selectedGate.name;
    });
  }

  /**
   * Selects an appropriate terminal for the given flight
   *
   * There may be constraints (e.g. callsign prefix or aircraft types)
   *
   * @param flight
   * @returns a reproducible terminal with a gate list
   */
  selectTerminal(flight) {
    // filter the terminal based on constraints of the flight
    const availableTerminals = this.config.terminals.filter((terminal) => {
      return true;
    });
    // only 1 terminal?
    if (availableTerminals.length == 1) {
      return availableTerminals[0];
    }
    // multiple choices, key the flight and pick one
    const flightHash = this.calculateHashNumber(flight);
    return availableTerminals[flightHash % availableTerminals.length];
  }

  
  /**
   * Selects an appropriate gate from the passed in terminal for the given flight
   *
   * There may be constraints (e.g. callsign prefix or aircraft types)
   *
   * @param flight
   * @param terminal containing gates
   * @returns a reproducible gate
   */
  selectGate(flight, terminal) {
    // filter the gate based on constraints of the flight
    const availableGates = terminal.gates.filter((terminal) => {
      return true;
    });
    // only 1 terminal?
    if (availableGates.length == 1) {
      return availableGates[0];
    }
    // multiple choices, key/reuse the flight and pick one
    const flightHash = this.calculateHashNumber(flight);
    return availableGates[flightHash % availableGates.length];
  }

  /**
   * Calculates a reproducible has number based on the characteristics of the flight
   */
  calculateHashNumber(flight) {
    // already calculated
    if (flight.hash) {
      return flight.hash;
    }
    // Concatenate the data points into a single string
    const inputString = `${flight.cid}_${flight.callsign}_${flight.departure}_${flight.departure}_${flight.deptime}_${flight.arrtime}`;

    // Convert the input string into a numerical value (simple hash)
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
      hash = (hash << 5) - hash + inputString.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    flight.hash = Math.abs(hash) // Ensure non-negative value and cache for reuse
    return flight.hash; 
  }
}
module.exports = VatFib;
