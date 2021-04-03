defmodule ErpWeb.PlanningView do

    use ErpWeb, :view
    alias ErpWeb.PlanningView

  def render("index.json", %{tasks: tasks}) do
    %{data: render_many(tasks, PlanningView, "task.json", as: :task)}
  end

  def render("show.json", %{task: task}) do
    %{data: render_one(task, PlanningView, "task.json")}
  end

  def render("task.json", %{task: task}) do
    %{id: task.id,
      task_name: task.task_name,
      task_description: task.description,
      start_time: task.start_time,
      end_time: task.end_time,
      employee_name: task.employee_name,
      status: task.status}
  end
end