// Finds the best way to make the "amount" weight with the weights
// given in "weights"
// Returns a map if successful, or undefined if not
export function getWeights(weights, amount, weightIndex = 0) {
    if (amount === 0) {
        return new Map();
    }
    if (weightIndex >= weights.length) {
        return null;
    }
    let weight = weights[weightIndex];
    weightIndex++;
    let canTake = Math.min(Math.floor(amount / weight.weight / 2) * 2, Math.floor(weight.amount / 2) * 2);
    for (let count = canTake; count >= 0; count--) {
        let change = getWeights(weights, (amount - weight.weight * count), weightIndex);
        if (change != null) {
            if (count != 0) {
                change.set(weight.weight,count);
                return change;
            }
            return change;
        }
    }
}