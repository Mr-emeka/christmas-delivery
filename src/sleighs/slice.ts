import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PixelPerTick } from "../models/PixelPerTick";
import { Pixel } from "../models/Pixel";
import { actions as worldActions } from "../world/slice";
import { Vector2D } from "../utils/Vector2D/Vector2D";
import { Position } from "../models/Position";
import { Heading, Sleigh } from "./Sleigh";

const initialState: Sleigh[] = [
  {
    id: "1",
    heading: Heading.Right,
    maxSpeed: 5 as PixelPerTick,
    position: {
      x: 400 as Pixel,
      y: 300 as Pixel,
    },
    command: null,
  },
];

export const { actions, reducer } = createSlice({
  name: "sleighs",
  initialState,
  reducers: {
    moveSleigh(
      state,
      action: PayloadAction<{ targetPosition: Position; sleighId: string }>
    ) {
      return state.map((sleigh) =>
        sleigh.id === action.payload.sleighId
          ? {
              ...sleigh,
              command: {
                name: "move",
                payload: action.payload.targetPosition,
              },
              heading:
                action.payload.targetPosition.x < sleigh.position.x
                  ? Heading.Left
                  : Heading.Right,
            }
          : sleigh
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(worldActions.wait, (state, action) =>
      state.map((sleigh) => {
        if (sleigh.command === null) return sleigh;
        const currentPosition = new Vector2D(sleigh.position);
        const targetPosition = new Vector2D(sleigh.command.payload);
        const movementNeeded = targetPosition.subtract(currentPosition);
        const direction = movementNeeded.normalize();
        const movementDistance = sleigh.maxSpeed;
        const nextPosition =
          movementNeeded.length <= movementDistance
            ? targetPosition
            : currentPosition.add(direction.scale(movementDistance));
        return {
          ...sleigh,
          position: nextPosition.toJSON(),
        };
      })
    );
  },
});
