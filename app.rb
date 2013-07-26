require "cuba"
require "mote"
require "cuba/contrib"
require "rack/protection"
require "ohm"
require "shield"
require "requests"

APP_SECRET = ENV.fetch("APP_SECRET")
REDIS_URL = ENV.fetch("REDIS_URL")
GITHUB_CLIENT_ID = ENV.fetch("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = ENV.fetch("GITHUB_CLIENT_SECRET")
GITHUB_OAUTH_AUTHORIZE = ENV.fetch("GITHUB_OAUTH_AUTHORIZE")
GITHUB_OAUTH_ACCESS_TOKEN = ENV.fetch("GITHUB_OAUTH_ACCESS_TOKEN")
GITHUB_FETCH_USER = ENV.fetch("GITHUB_FETCH_USER")

Cuba.plugin Cuba::Mote
Cuba.plugin Cuba::TextHelpers
Cuba.plugin Shield::Helpers

Ohm.connect(url: REDIS_URL)

Dir["./models/**/*.rb"].each  { |rb| require rb }
Dir["./routes/**/*.rb"].each  { |rb| require rb }

Dir["./helpers/**/*.rb"].each  { |rb| require rb }
Dir["./lib/**/*.rb"].each { |rb| require rb }

Cuba.plugin CompanyHelpers
Cuba.plugin DeveloperHelpers

Cuba.use Rack::MethodOverride
Cuba.use Rack::Session::Cookie,
  key: "job_board",
  secret: APP_SECRET

Cuba.use Rack::Protection
Cuba.use Rack::Protection::RemoteReferrer

Cuba.use Rack::Static,
  urls: %w[/js /css /img],
  root: "./public"

Cuba.define do
  persist_session!

  on root do
    render("home", title: "Home", current_company: current_company)
  end

  on authenticated(Company) do
    run Companies
  end

  on authenticated(Developer) do
    run Developers
  end

  on default do
    run Guests
  end
end
