(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(exports)
    : typeof define === "function" && define.amd
    ? define(["exports"], factory)
    : ((global = global || self), (global.VatFib = {}), factory(global.VatFib));
})(this, function (exports) {
  "use strict";
  let Version = "1.0.0";

  /**
   * Flight information board: Displays inbound and outbound flights with gate assignments and status
   *
   */
  class VatFib {
    /**
     * Builds a new VatFib instance using a given configuration.
     * @param {object} config
     */
    constructor(config) {
      // Default configuration
      this.config = {
        // Defaults to a main terminal
        terminals: [
          {
            // callsign: any
            // aircraft: any
            // region: any

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

    /**
     * Expands ranges in the terminals and gates
     * @private
     */
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

    /**
     * Expands ranges in the gates
     * @private
     */
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

    /**
     * Sets the flight data.
     *
     * This assigns terminal and gate names to the flights.
     *
     * @param {object} flights
     */
    setFlights(flights) {
      this.flights = flights;
      this.assignTerminalAndGates();
    }

    /**
     * Assigns terminal and gate names to the flights.
     *
     * @private
     */
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
     * @private
     * @param flight
     * @returns a reproducible terminal with a gate list
     */
    selectTerminal(flight) {
      // organize the terminals into best, ok and worse fit
      let availableTerminals = this.filterCandidates(
        this.config.terminals,
        flight
      );
      const shortlist = availableTerminals.best.length
        ? availableTerminals.best
        : availableTerminals.ok.length
        ? availableTerminals.ok
        : availableTerminals.worst;
      if (shortlist.length == 1) {
        return shortlist[0];
      }
      // multiple choices, key the flight and pick one
      const flightHash = this.calculateHashNumber(flight);
      return shortlist[flightHash % shortlist.length];
    }

    /**
     * Selects an appropriate gate from the passed in terminal for the given flight
     *
     * There may be constraints (e.g. callsign prefix or aircraft types)
     * @private
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
      const availableGates = this.filterCandidates(terminal.gates, flight);
      const shortlist = availableGates.best.length
        ? availableGates.best
        : availableGates.ok.length
        ? availableGates.ok
        : availableGates.worst;
      // only 1 terminal?
      if (shortlist.length == 1) {
        return shortlist[0];
      }
      // multiple choices, key/reuse the flight and pick one
      const flightHash = this.calculateHashNumber(flight);
      return shortlist[flightHash % shortlist.length];
    }

    filterCandidates(list, flight) {
      return list.reduce(
        (result, item) => {
          // accepts any flight, ok
          if (
            item.domestic == undefined &&
            item.callsign == undefined &&
            item.aircraft_short == undefined
          ) {
            result.ok.push(item);
            return result;
          }
          // specific region
          if (
            item.domestic !== undefined &&
            (item.domestic !== flight.domestic ||
              item.aircraft_short !== flight.aircraft_short)
          ) {
            result.worst.push(item);
            return result;
          }
          // any callsign
          if (item.callsign == undefined) {
            result.ok.push(item);
            return result;
          }

          if (item.callsign.test(flight.callsign)) {
            result.best.push(item);
            return result;
          }

          return result;
        },
        {
          best: [],
          ok: [],
          worst: [],
        }
      );
    }

    /**
     * Calculates a reproducible has number based on the characteristics of the flight
     * @private
     * @param flight
     */
    calculateHashNumber(flight) {
      // already calculated
      if (flight.hash) {
        return flight.hash;
      }
      // Concatenate the data points into a single string
      const inputString = `${flight.cid}_${flight.callsign}_${flight.departure}_${flight.arrival}_${flight.deptime}_${flight.arrtime}_${flight.aircraft_short}`;

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

  exports.VatFib = VatFib;
});
