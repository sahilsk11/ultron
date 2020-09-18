const { Intent } = require("../intent.js");

class EditWorkoutSetIntent extends Intent {
  constructor({ transcript, dbHandler }) {
    super({
      transcript,
      regex: [],
      utterances: ['edit set', 'set previous', 'change last set', 'edit the last set', 'edit last set', 'set last set', 'update set', 'update last set', 'update the last set'],
      intentName: "editWorkoutSetIntent",
      dbHandler
    });
  }

  async execute() {
    const { reps, intensity, weight } = this.parseSet(); //intensity is returned as float
    const changes = {};
    let message;
    if (reps) changes.reps = reps;
    if (intensity) changes.intensity = intensity;
    if (weight) changes.weight = weight;
    if (Object.keys(changes).length == 0) {
      message = "I don't see any updates with this request, sir."
    } else {
      const updated = await this.updateSet(changes);
      message = this.constructMessage(updated);
    }
    return { code: 200, message, intent: this.intentName }
  }

  constructMessage(updatedSet) {
    const workoutName = updatedSet.exercise || updatedSet.muscleGroups[0];
    let message = `Updated ${workoutName} set to`;
    if (updatedSet.reps) {
      message += ` ${updatedSet.reps} reps`
    } if (updatedSet.weight) {
      if (updatedSet.reps) message += ` at`
      message += ` ${updatedSet.weight} pounds`
    } if (updatedSet.intensity) {
      if (updatedSet.reps || updatedSet.weight) message += ` with`;
      message += ` ${Math.round(updatedSet.intensity * 100)}% intensity`
    }
    message += ".";
    return message;
  }

  async updateSet(changes) {
    const collection = await this.dbHandler.getCollection("gym", "exerciseHistory");
    const recentEntryList = await collection.find().sort({ "date": -1 }).limit(1).toArray();
    const recentSet = recentEntryList[0];
    const update = await collection.updateOne(
      { _id: recentSet._id },
      { $set: changes }
    );
    const updated = await collection.findOne({ _id: recentSet._id });
    return updated;
  }

  parseSet() {
    const metrics = [
      "reps",
      "intensity",
      "weight",
    ];
    const values = {};
    for (let metric of metrics) {
      if (metric == "intensity") {
        const iParse = this.parseIntensity();
        if (iParse !== null) {
          values["intensity"] = iParse;
          continue;
        }
      }
      const i = this.transcript.lastIndexOf(metric);
      if (i >= 0) {
        const valStartIndex = this.indexOfNextSpace(i, this.transcript) + 1;
        let valEndIndex = this.indexOfNextSpace(valStartIndex, this.transcript);
        if (valStartIndex < valEndIndex && !isNaN(this.transcript.substring(valStartIndex, valEndIndex))) {
          values[metric] = Number(this.transcript.substring(valStartIndex, valEndIndex));
          if (metric == "intensity") {
            values[metric] /= 100;
          }
        }
      }
    }
    return values;
  }

  parseIntensity() {
    const percentageIndex = this.transcript.lastIndexOf("%");
    if (percentageIndex > 2) {
      const intensity = this.transcript.substring(percentageIndex - 2, percentageIndex);
      if (!isNaN(intensity)) {
        return Number(intensity) / 100;
      }
    }
    return null;
  }
}

module.exports.IntentClass = EditWorkoutSetIntent;