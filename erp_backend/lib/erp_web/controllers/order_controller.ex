defmodule ErpWeb.OrderController do
  use ErpWeb, :controller
  import Ecto.Query, warn: false

  def show(conn, %{"id" => id}) do
    id = Integer.parse(id)
    order = Erp.Sales.Order.get_order!(id)
    render(conn, "show.json", order: order)
  end

  def show_all_orders(conn, _params) do
    orders = Erp.Sales.Order.list_orders()
    render(conn, "index.json", orders: orders)
  end
end
