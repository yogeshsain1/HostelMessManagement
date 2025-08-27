'use client'

import { useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Plus, Calendar as CalendarIcon, MapPin, Users } from 'lucide-react'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'en-US': enUS,
  },
})

interface Event {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  location?: string
  type: 'general' | 'maintenance' | 'meeting' | 'sports' | 'cultural' | 'academic' | 'emergency'
  hostelId?: string
  hostel?: {
    id: string
    name: string
  }
  creator: {
    id: string
    fullName: string
    email: string
  }
}

interface EventFormData {
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  type: string
  hostelId?: string
}

const eventTypeColors = {
  general: 'bg-blue-500',
  maintenance: 'bg-orange-500',
  meeting: 'bg-green-500',
  sports: 'bg-red-500',
  cultural: 'bg-purple-500',
  academic: 'bg-indigo-500',
  emergency: 'bg-red-600',
}

const eventTypeLabels = {
  general: 'General',
  maintenance: 'Maintenance',
  meeting: 'Meeting',
  sports: 'Sports',
  cultural: 'Cultural',
  academic: 'Academic',
  emergency: 'Emergency',
}

export default function EventsCalendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    type: 'general',
  })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch events',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch events',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Event created successfully',
        })
        setIsCreateDialogOpen(false)
        setFormData({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          location: '',
          type: 'general',
        })
        fetchEvents()
      } else {
        const error = await response.json()
        toast({
          title: 'Error',
          description: error.error || 'Failed to create event',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error creating event:', error)
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event)
  }

  const eventStyleGetter = (event: CalendarEvent) => {
    const backgroundColor = eventTypeColors[event.resource.type]
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    }
  }

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: Event
}

const EventComponent = ({ event }: { event: CalendarEvent }) => {
  const originalEvent = event.resource
  return (
    <div className="text-white font-medium">
      <div className="font-semibold">{originalEvent.title}</div>
      {originalEvent.location && (
        <div className="text-xs opacity-90 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {originalEvent.location}
        </div>
      )}
    </div>
  )
}

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Events Calendar</h2>
          <p className="text-muted-foreground">View and manage hostel events</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="type">Event Type</Label>
                <Select value={formData.type} onValueChange={(value: string) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(eventTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div style={{ height: '600px' }}>
            <Calendar
              localizer={localizer}
              events={events.map(event => ({
                id: event.id,
                title: event.title,
                start: new Date(event.startDate),
                end: new Date(event.endDate),
                resource: event,
              }))}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectEvent={(event) => handleEventSelect(event.resource)}
              eventPropGetter={eventStyleGetter}
              components={{
                event: EventComponent,
              }}
              views={['month', 'week', 'day']}
              defaultView="month"
            />
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <Badge className={`${eventTypeColors[selectedEvent.type]} text-white`}>
                  {eventTypeLabels[selectedEvent.type]}
                </Badge>
              </div>

              {selectedEvent.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(selectedEvent.startDate), 'PPP p')}
                  </p>
                </div>
                <div>
                  <Label>End Date</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(selectedEvent.endDate), 'PPP p')}
                  </p>
                </div>
              </div>

              {selectedEvent.location && (
                <div>
                  <Label>Location</Label>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedEvent.location}
                  </p>
                </div>
              )}

              {selectedEvent.hostel && (
                <div>
                  <Label>Hostel</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedEvent.hostel.name}
                  </p>
                </div>
              )}

              <div>
                <Label>Created by</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedEvent.creator.fullName} ({selectedEvent.creator.email})
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
