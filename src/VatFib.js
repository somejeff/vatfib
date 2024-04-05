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
    // If there are braces (ranges) in ther terminals and gates, expand the arrays
    this.expandRangedTerminals();
    this.expandRangedGates();
    //
    this.flights = {
      arrivals: [],
      departures: [],
    };
  }

  expandRangedTerminals() {
    this.config.terminals = [...this.config.terminals].reduce(
      (list, terminal) => {
        if (terminal.name.indexOf("{") == -1) {
          list.push(terminal);
          return list;
        }

        // "prefix{start..end}suffix"
        const pattern = terminal.name.match(/(.*)?\{(.*)\.\.(.*)\}(.*)?/);
        const prefix = pattern[1]; // may be undefined, keep leading/trailing spaces
        const start = pattern[2]; // may have leading 0s, so keep as string
        const end = pattern[3]; // may have leading 0s
        const suffix = pattern[4]; // may be undefined, keep leading/trailing spaces
        const count = Number.parseInt(end) - Number.parseInt(start) + 1;
        for (let i = 0; i < count; i++) {
          let digit = `${Number.parseInt(start) + i}`;
          digit = digit.padStart(start.length, "0");
          const entry = { ...terminal };
          entry.name = `${prefix || ""}${digit}${suffix || ""}`;
          list.push(entry);
        }

        return list;
      },
      []
    );
  }

  expandRangedGates() {
    this.config.terminals.forEach((terminal) => {
      // No gates?
      if (!terminal.gates) {
        return;
      }
      const gates = terminal.gates;
      terminal.gates = [...gates].reduce((list, gate) => {
        if (gate.name.indexOf("{") == -1) {
          list.push(gate);
          return list;
        }

        // "prefix{start..end}suffix"
        const pattern = gate.name.match(/(.*)?\{(.*)\.\.(.*)\}(.*)?/);
        const prefix = pattern[1]; // may be undefined, keep leading/trailing spaces
        const start = pattern[2]; // may have leading 0s, so keep as string
        const end = pattern[3]; // may have leading 0s
        const suffix = pattern[4]; // may be undefined, keep leading/trailing spaces
        const count = Number.parseInt(end) - Number.parseInt(start) + 1;
        for (let i = 0; i < count; i++) {
          let digit = `${Number.parseInt(start) + i}`;
          digit = digit.padStart(start.length, "0");
          const entry = { ...gate };
          entry.name = `${prefix || ""}${digit}${suffix || ""}`;
          list.push(entry);
        }

        return list;
      }, []);
    });
  }

  setFlights(flights) {
    this.flights = flights;
    this.assignTerminalAndGates();
  }

  assignTerminalAndGates() {
    this.flights.departures?.forEach((flight) => {
      const selectedTerminal = this.selectTerminal(flight);
      const selectedGate = this.selectGate(flight, selectedTerminal);
      flight.terminal = selectedTerminal?.name;
      flight.gate = selectedGate?.name;
    });

    this.flights.arrivals?.forEach((flight) => {
      const selectedTerminal = this.selectTerminal(flight);
      const selectedGate = this.selectGate(flight, selectedTerminal);
      flight.terminal = selectedTerminal?.name;
      flight.gate = selectedGate?.name;
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
    // no configured gates
    if (!terminal.gates) {
      return null;
    }
    // filter the gate based on constraints of the flight
    const availableGates = terminal.gates.filter((terminal) => {
      return true;
    });
    // no available gates
    if (!terminal.gates) {
      return null;
    }
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
    flight.hash = Math.abs(hash); // Ensure non-negative value and cache for reuse
    return flight.hash;
  }
}
module.exports = VatFib;
