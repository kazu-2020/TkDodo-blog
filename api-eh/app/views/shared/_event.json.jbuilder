# frozen_string_literal: true

json.type event[:type]
json.id event[:id]
json.name event[:name]
json.description event[:description]
json.startDate event[:startDate]
json.endDate event[:endDate]
json.eventAttendanceMode event[:eventAttendanceMode]
json.postalAddress event[:postalAddress]
json.place event[:place]
json.eventStatus event[:eventStatus]
json.dateCreated event[:dateCreated]
json.dateModified event[:dateModified]
json.set_raw! :identifierGroup, event[:identifierGroup].to_json
json.undefinedSection event[:undefinedSection]
json.offersSameAs event[:undefinedSection]
json.url event[:url]
