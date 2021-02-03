defmodule Erp.Material do
  use Ecto.Schema
  import Ecto.Changeset

  schema "materials" do
    field :material_id, :integer
    field :quantity, :integer
    field :plant_id, :id

    timestamps()
  end

  @doc false
  def changeset(material, attrs) do
    material
    |> cast(attrs, [:material_id, :quantity])
    |> validate_required([:material_id, :quantity])
    |> unique_constraint(:material_id)
  end
end